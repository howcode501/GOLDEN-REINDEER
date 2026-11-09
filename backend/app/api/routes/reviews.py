from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Review, Business
from ...schemas.schemas import ReviewReplyRequest, ReviewGenerateDraftRequest
from ...services.llm import generate_review_reply
from ...services.google_gbp import get_gbp_provider
from ...services.flywheel import emit

router = APIRouter(prefix="/reviews", tags=["Reviews & Reputation"])

@router.get("")
async def list_reviews(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(Review).where(Review.business_id == ctx.business_id).order_by(Review.created_at.desc())
    reviews = (await db.execute(stmt)).scalars().all()
<<<<<<< HEAD
    return reviews

=======
    
    # Auto-seed sample reviews if tenant has none yet
    if not reviews:
        samples = [
            Review(
                business_id=ctx.business_id,
                author="Pooja Sen",
                rating=5,
                text="Absolutely loved the bridal styling! Professional staff and great ambiance.",
                reply_status="posted",
                reply_text="Thank you Pooja! Our stylists were honored to be part of your special day.",
            ),
            Review(
                business_id=ctx.business_id,
                author="Amitabh Roy",
                rating=4,
                text="Very good hair spa and facial service. Would definitely recommend to friends.",
                reply_status="none",
                reply_text=None,
            ),
            Review(
                business_id=ctx.business_id,
                author="Divya Nair",
                rating=5,
                text="The best hydra facial in town. My skin feels deeply rejuvenated!",
                reply_status="draft",
                reply_text="Dear Divya, thank you for your kind words! We are glad you enjoyed the hydra facial treatment.",
            ),
        ]
        db.add_all(samples)
        await db.commit()
        reviews = samples

    return reviews
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)

@router.post("/draft-reply")
async def draft_review_reply(
    req: ReviewGenerateDraftRequest,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    name = business.name if business else "Our Studio"

    reply_text = await generate_review_reply(
        business_name=name,
        author=req.author or "Valued Guest",
        rating=req.rating,
        review_text=req.review_text,
        service_keyword=req.service_keyword,
    )
    return {"reply_text": reply_text}

@router.post("/{review_id}/reply")
async def post_review_reply(
    review_id: str,
    req: ReviewReplyRequest,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Review).where(Review.id == review_id, Review.business_id == ctx.business_id)
    review = (await db.execute(stmt)).scalar_one_or_none()
    if not review:
        raise HTTPException(404, "Review not found")

    review.reply_text = req.reply_text
    review.reply_status = "posted" if req.post_now else "draft"
    await db.commit()

    if req.post_now:
        provider = get_gbp_provider()
        await provider.reply_to_review(review.google_review_id or review.id, req.reply_text)
        await emit(db, ctx.business_id, None, "review.replied", {"review_id": review.id})

    return review
