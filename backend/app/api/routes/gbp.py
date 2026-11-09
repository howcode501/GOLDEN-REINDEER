from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import GBPPost, GBPProfile, Business
from ...schemas.schemas import KeywordGenerateRequest, ProfileRewriteRequest, GBPPostCreate
from ...services.google_gbp import get_gbp_provider, generate_local_keywords, generate_profile_rewrite_diff
from ...services.flywheel import emit

router = APIRouter(prefix="/gbp", tags=["Google AI Agent"])

@router.get("/profile")
async def get_profile(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Golden Reindeer Studio"
    
    provider = get_gbp_provider()
    profile = await provider.get_profile(business.google_place_id if business else "mock_place_id")
    profile["name"] = name
    return profile

@router.post("/keywords")
async def generate_keywords(req: KeywordGenerateRequest):
    return await generate_local_keywords(
        business_name=req.business_name,
        vertical=req.vertical,
        city=req.city,
    )

@router.post("/rewrite")
async def rewrite_profile(
    req: ProfileRewriteRequest,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Our Business"
    vertical = business.vertical if business else "salon"

    diff = await generate_profile_rewrite_diff(
        current_description=req.current_description,
        keywords=req.keywords,
        business_name=name,
        vertical=vertical,
    )
    return diff

@router.get("/posts")
async def list_posts(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(GBPPost).where(GBPPost.business_id == ctx.business_id).order_by(GBPPost.publish_at.desc())
    posts = (await db.execute(stmt)).scalars().all()
    
    # Auto-seed initial post for preview if empty
    if not posts:
        sample = GBPPost(
            business_id=ctx.business_id,
            body="✨ Experience our signature hydra-facial & wellness packages this weekend! Special 20% privilege for advance WhatsApp bookings.",
<<<<<<< HEAD
            keyword="best hydra facial in New York NY",
=======
            keyword="best hydra facial in Navi Mumbai",
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
            status="published",
            published_at=datetime.utcnow(),
        )
        db.add(sample)
        await db.commit()
        posts = [sample]

    return posts

@router.post("/posts")
async def create_post(
    req: GBPPostCreate,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    post = GBPPost(
        business_id=ctx.business_id,
        body=req.body,
        keyword=req.keyword,
        status="published" if not req.publish_at else "scheduled",
        publish_at=req.publish_at or datetime.utcnow(),
        published_at=datetime.utcnow() if not req.publish_at else None,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)

    await emit(db, ctx.business_id, None, "gbp.post_published", {"post_id": post.id, "keyword": post.keyword})
    return post
<<<<<<< HEAD

@router.get("/geo-grid")
async def get_geo_grid(
    keyword: str = "hair spa salon near me",
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db)
):
    """Returns a 3x3 local map rank geo-grid across the store's neighborhood."""
    from ...services.google_gbp import generate_geo_grid_ranks
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Glow & Grace Studio"
    return await generate_geo_grid_ranks(business_name=name, keyword=keyword)

@router.get("/competitor-categories")
async def get_competitor_categories(
    city: str = "New York",
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db)
):
    """Reverse-engineers top local competitor categories to find missing high-impact secondary categories."""
    from ...services.google_gbp import analyze_competitor_categories
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Glow & Grace Studio"
    vertical = business.vertical if business else "salon"
    return await analyze_competitor_categories(business_name=name, vertical=vertical, city=city)

@router.post("/photo-prompt")
async def trigger_photo_prompt(
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db)
):
    """Triggers the weekly WhatsApp photo boost reminder to the business owner."""
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Glow & Grace Studio"
    
    await emit(db, ctx.business_id, None, "whatsapp.photo_prompt_sent", {
        "text": f"📸 Weekly Google Photo Boost prompt sent to {name} owner on WhatsApp.",
        "status": "delivered"
    })
    return {
        "success": True,
        "message": f"Weekly photo reminder delivered to owner's WhatsApp for {name}."
    }

=======
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
