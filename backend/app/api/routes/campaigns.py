from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Campaign, CampaignRecipient, Business, Contact
from ...schemas.schemas import CampaignCreate, SegmentPreviewRequest
from ...services.llm import generate_campaign_copy
from ...services.segmentation import get_segmented_audience, get_due_rebooking_contacts
from ...services.flywheel import emit

router = APIRouter(prefix="/campaigns", tags=["WhatsApp Marketing Agent"])

@router.get("")
async def list_campaigns(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(Campaign).where(Campaign.business_id == ctx.business_id).order_by(Campaign.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("")
async def create_campaign(req: CampaignCreate, ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    # 1. Fetch business details
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Our Boutique"
    vertical = business.vertical if business else (req.target_vertical or "salon")

    # 2. Generate AI marketing creative copy
    copy = await generate_campaign_copy(
        business_name=name,
        vertical=vertical,
        goal=req.goal or "festive_offer",
        offer_details=req.custom_offer,
    )

    campaign = Campaign(
        business_id=ctx.business_id,
        name=req.name,
        goal=req.goal,
        message_template=f"{copy['headline']}\n\n{copy['body']}\n\n{copy['cta']}",
        segment={"inactive_days": 30, "min_ltv": 0.0, "require_opted_in": True},
        status="draft",
        created_at=datetime.utcnow(),
    )
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)

    await emit(db, ctx.business_id, None, "campaign.drafted", {"campaign_id": campaign.id, "name": campaign.name})
    return campaign

@router.post("/{campaign_id}/preview-segment")
async def preview_segment(
    campaign_id: str,
    req: SegmentPreviewRequest,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    contacts = await get_segmented_audience(
        db,
        business_id=ctx.business_id,
        inactive_days=req.inactive_days,
        min_ltv=req.min_ltv,
        require_opted_in=req.require_opted_in,
    )
    return {
        "campaign_id": campaign_id,
        "eligible_count": len(contacts),
        "contacts": [
            {
                "id": c.id,
                "name": c.name or "Valued Customer",
                "phone": c.phone,
                "ltv": float(c.lifetime_value),
                "last_purchase_at": c.last_purchase_at,
            }
            for c in contacts[:10]
        ],
    }

@router.post("/{campaign_id}/send")
async def send_campaign(
    campaign_id: str,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Campaign).where(Campaign.id == campaign_id, Campaign.business_id == ctx.business_id)
    campaign = (await db.execute(stmt)).scalar_one_or_none()
    if not campaign:
        raise HTTPException(404, "Campaign not found")

    contacts = await get_segmented_audience(
        db,
        business_id=ctx.business_id,
        inactive_days=campaign.segment.get("inactive_days", 30),
        min_ltv=campaign.segment.get("min_ltv", 0.0),
        require_opted_in=True,
    )

    for c in contacts:
        # Check if already added
        existing = (await db.execute(select(CampaignRecipient).where(
            CampaignRecipient.campaign_id == campaign.id,
            CampaignRecipient.contact_id == c.id
        ))).scalar_one_or_none()
        if not existing:
            recipient = CampaignRecipient(
                campaign_id=campaign.id,
                contact_id=c.id,
                status="sent",
                sent_at=datetime.utcnow(),
            )
            db.add(recipient)

    campaign.status = "done"
    await db.commit()

    await emit(db, ctx.business_id, None, "campaign.sent", {
        "campaign_id": campaign.id,
        "recipients_count": len(contacts),
    })

    return {
        "status": "success",
        "campaign_id": campaign.id,
        "sent_count": len(contacts),
    }

@router.get("/rebooking-opportunities")
async def rebooking_opportunities(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    """Identifies customers who are due for repeat visits based on vertical time cycles."""
    return await get_due_rebooking_contacts(db, ctx.business_id)
