from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...schemas.schemas import ContactCreate, PurchaseCreate
from ...models.entities import Contact, Purchase, Event

router = APIRouter(tags=["CRM & Shared Brain"])

@router.get("/contacts")
async def list_contacts(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(Contact).where(Contact.business_id == ctx.business_id).limit(100)
    res = await db.execute(stmt)
    contacts = res.scalars().all()
    return contacts

@router.post("/contacts")
async def create_contact(req: ContactCreate, ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    contact = Contact(
        business_id=ctx.business_id,
        name=req.name,
        phone=req.phone,
        stage=req.stage,
        source=req.source,
        opted_in=req.opted_in,
        tags=req.tags,
    )
    db.add(contact)
    await db.commit()
    await db.refresh(contact)

    # Emit flywheel event
    evt = Event(
        business_id=ctx.business_id,
        contact_id=contact.id,
        type="lead.captured",
        payload={"phone": contact.phone, "source": contact.source},
    )
    db.add(evt)
    await db.commit()

    return contact

@router.post("/purchases")
async def record_purchase(req: PurchaseCreate, ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    purchase = Purchase(
        business_id=ctx.business_id,
        contact_id=req.contact_id,
        item=req.item,
        amount=req.amount,
    )
    db.add(purchase)
    await db.commit()
    await db.refresh(purchase)

    # Update contact lifetime value & stage
    stmt = select(Contact).where(Contact.id == req.contact_id, Contact.business_id == ctx.business_id)
    c_res = await db.execute(stmt)
    contact = c_res.scalar_one_or_none()
    if contact:
        contact.lifetime_value = float(contact.lifetime_value) + req.amount
        contact.stage = "customer"
        await db.commit()

    # Emit purchase.recorded event (triggers review request flywheel if enabled)
    evt = Event(
        business_id=ctx.business_id,
        contact_id=req.contact_id,
        type="purchase.recorded",
        payload={"amount": req.amount, "item": req.item},
    )
    db.add(evt)
    await db.commit()

    return purchase
