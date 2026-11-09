<<<<<<< HEAD
from fastapi import APIRouter, Depends, Response, Query
=======
from fastapi import APIRouter, Depends, Response
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.db import get_db
from ...schemas.schemas import AuditRequest
from ...models.entities import Audit
<<<<<<< HEAD
from ...services.profile_audit import calculate_audit_score_async, search_places_unified
=======
from ...services.profile_audit import calculate_audit_score
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
from ...services.qr import review_qr_png

router = APIRouter(prefix="/booster", tags=["Free GBP Booster & Places Search"])

<<<<<<< HEAD
@router.get("/search-google")
async def search_places(query: str = Query(..., description="Business name or place to search")):
    """Searches real business listings on Google / Geoapify."""
    results = await search_places_unified(query)
    return results

@router.post("/audit")
async def run_audit(req: AuditRequest, db: AsyncSession = Depends(get_db)):
    place_id = req.place_id or f"place_{req.business_name.lower().replace(' ', '_')}"
    report_data = await calculate_audit_score_async(req.business_name, place_id)

    report_data["name"] = req.business_name
    report_data["business_name"] = req.business_name
    report_data["phone"] = req.phone
    report_data["qr_url"] = f"/api/booster/qr/{place_id}"

    # Normalize issues format for frontend display
    formatted_issues = []
    for issue in report_data.get("issues", []):
        formatted_issues.append({
            "title": issue.get("title", ""),
            "fix": issue.get("fix", ""),
            "weight": issue.get("weight", 10),
            "status": "critical" if issue.get("severity") == "high" else "warning",
        })
    if formatted_issues:
        report_data["issues"] = formatted_issues

    try:
        audit_entry = Audit(
            place_id=place_id,
            phone=req.phone,
            score=report_data["score"],
            report=report_data,
        )
        db.add(audit_entry)
        await db.commit()
    except Exception:
        pass

=======
@router.post("/audit")
async def run_audit(req: AuditRequest, db: AsyncSession = Depends(get_db)):
    place_id = req.place_id or f"place_{req.business_name.lower().replace(' ', '_')}"
    report_data = calculate_audit_score(req.business_name, place_id)

    audit_entry = Audit(
        place_id=place_id,
        phone=req.phone,
        score=report_data["score"],
        report=report_data,
    )
    db.add(audit_entry)
    await db.commit()

    report_data["qr_url"] = f"/api/booster/qr/{place_id}"
    report_data["phone"] = req.phone
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
    return report_data

@router.get("/qr/{place_id}")
async def get_review_qr(place_id: str):
    png_bytes = review_qr_png(place_id)
    return Response(content=png_bytes, media_type="image/png")
