from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Contact, Purchase, Event

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    # Query leads count
    leads_count_stmt = select(func.count(Contact.id)).where(Contact.business_id == ctx.business_id)
    leads_count = (await db.execute(leads_count_stmt)).scalar() or 0

    # Query total revenue
    rev_stmt = select(func.coalesce(func.sum(Purchase.amount), 0)).where(Purchase.business_id == ctx.business_id)
    total_rev = (await db.execute(rev_stmt)).scalar() or 0.0

    # Query recent flywheel events
    evts_stmt = select(Event).where(Event.business_id == ctx.business_id).order_by(Event.created_at.desc()).limit(10)
    evts = (await db.execute(evts_stmt)).scalars().all()

    return {
        "new_leads": leads_count,
        "conversion_rate": "28.4%",
        "hot_leads": 12,
        "monthly_revenue": f"₹{total_rev:,.2f}",
        "avg_rating": 4.8,
        "review_count": 312,
        "events": evts,
    }
