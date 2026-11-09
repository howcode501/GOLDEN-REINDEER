from typing import List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.entities import Contact, Business

VERTICAL_REVISIT_DEFAULTS = {
    "salon": 35,       # 4-5 weeks for hair/spa/grooming
    "clinic": 28,      # 4 weeks for follow-ups
    "gym": 30,         # Monthly membership renewals
    "restaurant": 14,  # Bi-weekly dining / takeaway
    "pest_control": 90,# Quarterly service treatment
    "other": 30,
}

async def get_segmented_audience(
    db: AsyncSession,
    business_id: str,
    inactive_days: int = 30,
    min_ltv: float = 0.0,
    require_opted_in: bool = True,
) -> List[Contact]:
    """
    Selects high-potential customer audience for marketing campaigns.
    Enforces compliance: only contacts with explicit WhatsApp marketing consent (opted_in=True) are selected.
    """
    cutoff = datetime.utcnow() - timedelta(days=inactive_days)

    stmt = select(Contact).where(
        Contact.business_id == business_id,
        Contact.stage == "customer",
        Contact.lifetime_value >= min_ltv,
    )
    if require_opted_in:
        stmt = stmt.where(Contact.opted_in == True)

    res = await db.execute(stmt)
    contacts = res.scalars().all()

    # Filter contacts whose last purchase was prior to cutoff, or without recorded last purchase
    filtered = [
        c for c in contacts
        if not c.last_purchase_at or c.last_purchase_at <= cutoff
    ]
    return filtered

async def get_due_rebooking_contacts(db: AsyncSession, business_id: str) -> List[Dict[str, Any]]:
    """
    Identifies repeat-purchase opportunities:
    Computes customers whose gap since their last purchase exceeds their vertical's revisit window.
    """
    b_res = await db.execute(select(Business).where(Business.id == business_id))
    business = b_res.scalar_one_or_none()
    vertical = business.vertical if business else "other"
    cycle_days = VERTICAL_REVISIT_DEFAULTS.get(vertical, 30)
    rebooking_threshold = datetime.utcnow() - timedelta(days=cycle_days)

    stmt = select(Contact).where(
        Contact.business_id == business_id,
        Contact.stage == "customer",
        Contact.opted_in == True,
        Contact.last_purchase_at <= rebooking_threshold,
    )
    res = await db.execute(stmt)
    due_contacts = res.scalars().all()

    results = []
    for c in due_contacts:
        days_since = (datetime.utcnow() - c.last_purchase_at).days if c.last_purchase_at else cycle_days
        results.append({
            "contact_id": c.id,
            "name": c.name or "Valued Customer",
            "phone": c.phone,
            "days_since_visit": days_since,
            "recommended_action": f"Send {vertical.capitalize()} Rebooking Nudge (Overdue by {days_since - cycle_days} days)",
        })
    return results
