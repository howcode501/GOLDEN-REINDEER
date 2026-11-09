import logging
from datetime import datetime, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select
from ..core.db import SessionLocal
from ..models.entities import Appointment, GBPPost, BusinessAutomation
from ..services.google_gbp import get_gbp_provider
from ..services.flywheel import emit

logger = logging.getLogger("golden_reindeer.scheduler")

scheduler = AsyncIOScheduler()

async def send_due_appointment_reminders():
    """
    Scans for upcoming appointments within the next 24 hours.
    Sends WhatsApp reminders if the 'no_show_reminders' automation is enabled.
    """
    async with SessionLocal() as db:
        try:
            now = datetime.utcnow()
            horizon = now + timedelta(hours=24)
            
            stmt = select(Appointment).where(
                Appointment.status == "booked",
                Appointment.starts_at >= now,
                Appointment.starts_at <= horizon,
                Appointment.reminder_sent_at.is_(None),
            )
            res = await db.execute(stmt)
            appts = res.scalars().all()

            for appt in appts:
                # Check if business has no-show reminders enabled
                auto_stmt = select(BusinessAutomation).where(
                    BusinessAutomation.business_id == appt.business_id,
                    BusinessAutomation.key == "no_show_reminders",
                )
                auto = (await db.execute(auto_stmt)).scalar_one_or_none()
                if auto and auto.enabled:
                    appt.reminder_sent_at = now
                    await db.commit()
                    await emit(db, appt.business_id, appt.contact_id, "appointment.reminder_sent", {
                        "appointment_id": appt.id,
                        "starts_at": str(appt.starts_at),
                    })
                    logger.info(f"Sent automated WhatsApp appointment reminder for {appt.id}")
        except Exception as e:
            logger.error(f"Error in send_due_appointment_reminders job: {e}")

async def publish_due_gbp_posts():
    """
    Scans for scheduled Google Business Profile posts whose publish time has arrived.
    Publishes to Google GBP and updates status to 'published'.
    """
    async with SessionLocal() as db:
        try:
            now = datetime.utcnow()
            stmt = select(GBPPost).where(
                GBPPost.status == "scheduled",
                GBPPost.publish_at <= now,
            )
            posts = (await db.execute(stmt)).scalars().all()
            provider = get_gbp_provider()

            for post in posts:
                await provider.create_post(post.business_id, post.body)
                post.status = "published"
                post.published_at = now
                await db.commit()
                await emit(db, post.business_id, None, "gbp.post_published", {"post_id": post.id})
                logger.info(f"Auto-published scheduled GBP post {post.id}")
        except Exception as e:
            logger.error(f"Error in publish_due_gbp_posts job: {e}")

# Register recurring jobs
scheduler.add_job(send_due_appointment_reminders, "interval", minutes=5)
scheduler.add_job(publish_due_gbp_posts, "interval", minutes=10)
