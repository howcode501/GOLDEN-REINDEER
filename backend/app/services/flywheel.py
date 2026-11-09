import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.entities import Event, BusinessAutomation, ReviewRequest, Contact

logger = logging.getLogger("golden_reindeer.flywheel")

async def is_automation_enabled(db: AsyncSession, business_id: str, key: str) -> bool:
    """Checks whether a particular switch in the Automation Store is enabled for the business."""
    stmt = select(BusinessAutomation).where(
        BusinessAutomation.business_id == business_id,
        BusinessAutomation.key == key
    )
    res = await db.execute(stmt)
    entry = res.scalar_one_or_none()
    return entry.enabled if entry else False

async def emit(
    db: AsyncSession,
    business_id: str,
    contact_id: Optional[str],
    event_type: str,
    payload: Optional[Dict[str, Any]] = None,
) -> Event:
    """
    Central event dispatcher for Golden Reindeer's Flywheel.
    Logs the event into the shared brain and triggers reactions across agents.
    """
    payload = payload or {}
    
    # 1. Record event in Shared Brain (events table)
    evt = Event(
        business_id=business_id,
        contact_id=contact_id,
        type=event_type,
        payload=payload,
        created_at=datetime.utcnow(),
    )
    db.add(evt)
    await db.commit()
    await db.refresh(evt)
    logger.info(f"Flywheel event emitted: {event_type} for business {business_id}")

    # 2. React to events based on Automation Store rules
    
    # Flywheel loop: purchase.recorded -> auto review request
    if event_type == "purchase.recorded" and contact_id:
        if await is_automation_enabled(db, business_id, "review_requests"):
            # Check if review request was already sent recently
            req = ReviewRequest(
                business_id=business_id,
                contact_id=contact_id,
                sent_at=datetime.utcnow(),
            )
            db.add(req)
            await db.commit()
            logger.info(f"Flywheel triggered review request for contact {contact_id}")

    # Flywheel loop: lead asking price / booking intent -> hot lead alert
    elif event_type == "lead.hot" and contact_id:
        if await is_automation_enabled(db, business_id, "hot_lead_alerts"):
            # Update contact tags to include 'hot_lead'
            stmt = select(Contact).where(Contact.id == contact_id, Contact.business_id == business_id)
            c_res = await db.execute(stmt)
            contact = c_res.scalar_one_or_none()
            if contact:
                current_tags = list(contact.tags or [])
                if "hot_lead" not in current_tags:
                    current_tags.append("hot_lead")
                    contact.tags = current_tags
                    await db.commit()
            logger.info(f"Flywheel tagged hot lead {contact_id} and alerted business")

    return evt
