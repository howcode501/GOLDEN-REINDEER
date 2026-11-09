<<<<<<< HEAD
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Site, SitePage, Business, Event
from ...services.website_gen import (
    generate_instant_site_html,
    generate_local_seo_page_html,
    NYC_SERVICES,
    NYC_NEIGHBORHOODS,
)

router = APIRouter(prefix="/sites", tags=["Instant Website & Programmatic Local SEO"])


async def get_or_create_business_site(business_id: str, db: AsyncSession) -> Site:
    stmt = select(Site).where(Site.business_id == business_id)
    site = (await db.execute(stmt)).scalar_one_or_none()
    if not site:
        b_res = await db.execute(select(Business).where(Business.id == business_id))
        business = b_res.scalar_one_or_none()
        name = business.name if business else "Glow & Grace Studio"
        slug = name.lower().replace(" ", "-").replace("&", "and")

        site = Site(
            id=str(uuid.uuid4()),
            business_id=business_id,
            slug=slug,
            tier="seo",
            data={
                "name": name,
                "address": "482 Broome St, New York, NY 10013",
                "phone": business.phone if business and business.phone else "+1 (212) 555-0198",
                "category": "Luxury Hair Salon & MedSpa",
                "rating": 4.9,
                "reviews_count": 184,
            },
        )
        db.add(site)
        await db.commit()
        await db.refresh(site)
    return site


@router.get("/current")
async def get_current_site(
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns the current business's website details, configuration,
    and all generated programmatic local SEO landing pages.
    """
    site = await get_or_create_business_site(ctx.business_id, db)

    # Get all pages
    p_stmt = select(SitePage).where(SitePage.site_id == site.id).order_by(SitePage.path)
    pages = (await db.execute(p_stmt)).scalars().all()

    # If no pages exist yet, auto-generate the 25 matrix pages so the client sees full results immediately
    if len(pages) == 0:
        await generate_programmatic_pages_internal(site, ctx.business_id, db)
        pages = (await db.execute(p_stmt)).scalars().all()

    pages_list = []
    for p in pages:
        parts = p.path.strip("/").split("/")
        srv_id = parts[1] if len(parts) > 1 else ""
        neigh_id = parts[2] if len(parts) > 2 else ""
        pages_list.append({
            "id": p.id,
            "path": p.path,
            "title": p.title,
            "meta_description": p.meta_description,
            "service_id": srv_id,
            "neighborhood_id": neigh_id,
            "schema_valid": True,
            "index_status": "Indexed & Active",
        })

    return {
        "site": {
            "id": site.id,
            "slug": site.slug,
            "domain": f"https://{site.slug}.reindeer.page",
            "tier": site.tier,
            "status": "published",
            "ssl": "Active (Let's Encrypt)",
            "speed_score": 99,
            "business_data": site.data,
        },
        "stats": {
            "total_pages": len(pages_list),
            "services_count": len(NYC_SERVICES),
            "neighborhoods_count": len(NYC_NEIGHBORHOODS),
            "targeted_keywords": len(pages_list) * 4,
            "est_monthly_searches": "8,400+",
            "avg_load_time": "0.38s",
        },
        "services": NYC_SERVICES,
        "neighborhoods": NYC_NEIGHBORHOODS,
        "pages": pages_list,
    }


async def generate_programmatic_pages_internal(site: Site, business_id: str, db: AsyncSession):
    # Clear existing pages
    await db.execute(delete(SitePage).where(SitePage.site_id == site.id))

    new_pages = []
    for srv in NYC_SERVICES:
        for neigh in NYC_NEIGHBORHOODS:
            path = f"/services/{srv['id']}/{neigh['id']}"
            title = f"{srv['title']} in {neigh['name']} | {site.data.get('name', 'Glow & Grace Studio')}"
            desc = f"Book top-rated {srv['title']} in {neigh['name']}, NYC. Near {neigh['landmarks']}. 1-tap WhatsApp booking available now."
            html_content = generate_local_seo_page_html(site.data, srv, neigh)

            page = SitePage(
                id=str(uuid.uuid4()),
                site_id=site.id,
                path=path,
                title=title,
                meta_description=desc,
                html=html_content,
            )
            new_pages.append(page)

    db.add_all(new_pages)
    await db.commit()

    # Emit flywheel event
    event = Event(
        business_id=business_id,
        type="seo.pages_generated",
        payload={
            "site_id": site.id,
            "total_pages": len(new_pages),
            "strategy": "5 Services x 5 NYC Neighborhoods Programmatic Local SEO",
            "timestamp": datetime.utcnow().isoformat(),
        },
    )
    db.add(event)
    await db.commit()
    return len(new_pages)


@router.post("/generate-programmatic")
async def generate_programmatic_pages(
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    """
    Executes the Programmatic Local SEO Generator:
    Generates 25 high-ranking landing pages (5 services x 5 neighborhoods)
    with Schema.org LocalBusiness & Service JSON-LD, localized landmarks,
    and WhatsApp click-to-book conversion widgets.
    """
    site = await get_or_create_business_site(ctx.business_id, db)
    count = await generate_programmatic_pages_internal(site, ctx.business_id, db)
    return {
        "status": "success",
        "message": f"Successfully generated {count} programmatic local SEO pages with Google Schema markup.",
        "pages_count": count,
        "sitemap_url": f"/api/sites/{site.slug}/sitemap.xml",
    }


@router.get("/preview/page/{page_id}")
async def preview_page_by_id(
    page_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Returns HTML content of a specific page for interactive preview modal / iframe."""
    p_stmt = select(SitePage).where(SitePage.id == page_id)
    page = (await db.execute(p_stmt)).scalar_one_or_none()
    if not page:
        raise HTTPException(404, "Page not found")
    return Response(content=page.html, media_type="text/html")


@router.get("/{slug}")
async def view_site(slug: str, db: AsyncSession = Depends(get_db)):
    """Public endpoint to view the business's main website."""
    stmt = select(Site).where(Site.slug == slug)
    site = (await db.execute(stmt)).scalar_one_or_none()
    if not site:
        demo_html = generate_instant_site_html({
            "name": slug.replace("-", " ").title(),
            "address": "482 Broome St, New York, NY 10013",
            "phone": "+1 (212) 555-0198",
=======
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...models.entities import Site, Business
from ...services.website_gen import generate_instant_site_html

router = APIRouter(prefix="/sites", tags=["Instant Website & SEO"])

@router.post("/generate")
async def generate_site(
    slug: str,
    ctx: Ctx = Depends(current_ctx),
    db: AsyncSession = Depends(get_db),
):
    b_res = await db.execute(select(Business).where(Business.id == ctx.business_id))
    business = b_res.scalar_one_or_none()
    
    data = {
        "name": business.name if business else "Golden Reindeer Studio",
        "address": "Sector 30A, Vashi, Navi Mumbai",
        "phone": business.phone if business and business.phone else "+91 98123 45678",
        "category": business.vertical.capitalize() if business else "Salon",
        "rating": 4.8,
        "reviews_count": 184,
    }
    
    site = Site(
        business_id=ctx.business_id,
        slug=slug.lower().replace(" ", "-"),
        tier="free",
        data=data,
    )
    db.add(site)
    await db.commit()
    await db.refresh(site)
    return site

@router.get("/{slug}")
async def view_site(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Site).where(Site.slug == slug)
    site = (await db.execute(stmt)).scalar_one_or_none()
    if not site:
        # Generate on the fly for demo if not saved
        demo_html = generate_instant_site_html({
            "name": slug.replace("-", " ").title(),
            "address": "Local City Center",
            "phone": "+91 98000 00000",
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
        })
        return Response(content=demo_html, media_type="text/html")

    html = generate_instant_site_html(site.data)
    return Response(content=html, media_type="text/html")
<<<<<<< HEAD


@router.get("/{slug}/page/{service_id}/{neighborhood_id}")
async def view_local_page(
    slug: str,
    service_id: str,
    neighborhood_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint to view a specific programmatic landing page."""
    path = f"/services/{service_id}/{neighborhood_id}"
    stmt = select(Site).where(Site.slug == slug)
    site = (await db.execute(stmt)).scalar_one_or_none()
    if site:
        p_stmt = select(SitePage).where(SitePage.site_id == site.id, SitePage.path == path)
        page = (await db.execute(p_stmt)).scalar_one_or_none()
        if page:
            return Response(content=page.html, media_type="text/html")

    # Fallback generation on the fly
    srv = next((s for s in NYC_SERVICES if s["id"] == service_id), NYC_SERVICES[0])
    neigh = next((n for n in NYC_NEIGHBORHOODS if n["id"] == neighborhood_id), NYC_NEIGHBORHOODS[0])
    html = generate_local_seo_page_html(
        site.data if site else {"name": "Glow & Grace Studio", "phone": "+1 (212) 555-0198"},
        srv,
        neigh,
    )
    return Response(content=html, media_type="text/html")


@router.get("/{slug}/sitemap.xml")
async def get_sitemap_xml(slug: str, db: AsyncSession = Depends(get_db)):
    """Returns standard sitemap.xml for Google Search Console submission."""
    base_url = f"https://{slug}.reindeer.page"
    stmt = select(Site).where(Site.slug == slug)
    site = (await db.execute(stmt)).scalar_one_or_none()

    urls = [f"<url><loc>{base_url}</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>"]
    if site:
        p_stmt = select(SitePage).where(SitePage.site_id == site.id)
        pages = (await db.execute(p_stmt)).scalars().all()
        for p in pages:
            urls.append(f"<url><loc>{base_url}{p.path}</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>")

    xml_body = "\n".join(urls)
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{xml_body}
</urlset>"""
    return Response(content=sitemap, media_type="application/xml")
=======
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
