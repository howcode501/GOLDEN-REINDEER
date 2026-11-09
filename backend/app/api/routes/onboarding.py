from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Business, BusinessMember, BusinessAutomation, KnowledgeDoc
from ...schemas.schemas import OnboardingRequest
from ...services.flywheel import emit

router = APIRouter(prefix="/onboarding", tags=["Onboarding & Preset Seeding"])

VERTICAL_SEEDS = {
    "salon": [
        ("service", "Bridal & Pre-Bridal Makeup", "Complete HD and Airbrush bridal packages with skin prep and hairstyle trials."),
        ("price", "Service Price List", "Haircuts start at ₹650; Hydra-facials start at ₹2,500; Bridal packages start at ₹8,500."),
        ("faq", "Appointments & Cancellations", "We accept walk-ins based on slot availability. Advance booking is recommended."),
        ("hours", "Operating Hours", "Monday to Sunday: 10:00 AM to 8:30 PM."),
    ],
    "clinic": [
        ("service", "Dermatology & Skin Consultations", "Expert diagnosis and customized clinical treatments for acne, pigmentation, and hair loss."),
        ("price", "Consultation Fees", "Initial consultation is ₹800. Follow-up reviews within 15 days are ₹400."),
        ("faq", "Insurance & Reports", "Digital consultation receipts are dispatched via WhatsApp immediately."),
        ("hours", "Clinic Timings", "Monday to Saturday: 9:00 AM to 7:00 PM."),
    ],
    "gym": [
        ("service", "Calisthenics & Strength Coaching", "Certified trainer programs including bodyweight mastery, hypertrophy, and mobility."),
        ("price", "Membership Pricing", "Monthly membership ₹2,500; Quarterly ₹6,500; Annual all-access pass ₹18,000."),
        ("faq", "Trial Sessions", "First session is complimentary with prior WhatsApp reservation."),
        ("hours", "Gym Hours", "5:30 AM to 10:30 PM daily."),
    ],
    "restaurant": [
        ("service", "Dine-in, Private Events & Catering", "Multi-cuisine bistro and live barbecue counter."),
        ("price", "Menu Overview", "Starters from ₹280; Main courses from ₹450; Group party platters from ₹1,800."),
        ("faq", "Table Reservations", "Tables held up to 15 minutes past booking time."),
        ("hours", "Dining Hours", "11:30 AM to 11:30 PM every day."),
    ],
}

@router.post("")
async def complete_onboarding(
    req: OnboardingRequest,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    # 1. Check if business already exists
    stmt = select(Business).where(Business.id == ctx.business_id)
    business = (await db.execute(stmt)).scalar_one_or_none()
    
    if not business or business.id == "00000000-0000-0000-0000-000000000001":
        business = Business(
            name=req.business_name,
            vertical=req.vertical,
            phone=req.phone,
            google_place_id=req.google_place_id,
            plan=req.plan,
        )
        db.add(business)
        await db.commit()
        await db.refresh(business)

        member = BusinessMember(
            business_id=business.id,
            user_id=ctx.user_id,
            role="owner",
        )
        db.add(member)
    else:
        business.name = req.business_name
        business.vertical = req.vertical
        if req.phone:
            business.phone = req.phone
        if req.google_place_id:
            business.google_place_id = req.google_place_id

    # 2. Seed Default Automation Store Switches
    default_switches = [
        ("missed_call_textback", True),
        ("no_show_reminders", True),
        ("rebooking_timer", True),
        ("review_requests", True),
        ("winback_offers", False),
        ("hot_lead_alerts", True),
    ]
    for key, enabled in default_switches:
        existing = (await db.execute(select(BusinessAutomation).where(
            BusinessAutomation.business_id == business.id,
            BusinessAutomation.key == key
        ))).scalar_one_or_none()
        if not existing:
            db.add(BusinessAutomation(
                business_id=business.id,
                key=key,
                enabled=enabled,
                config={},
            ))

    # 3. Seed Vertical Knowledge Docs
    presets = VERTICAL_SEEDS.get(req.vertical.lower(), VERTICAL_SEEDS["salon"])
    for kind, title, content in presets:
        doc = KnowledgeDoc(
            business_id=business.id,
            kind=kind,
            title=title,
            content=content,
        )
        db.add(doc)

    await db.commit()
    await emit(db, business.id, None, "business.onboarded", {"vertical": business.vertical})

    return {
        "status": "success",
        "business_id": business.id,
        "name": business.name,
        "vertical": business.vertical,
    }
