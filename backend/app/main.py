from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from .core.config import settings
<<<<<<< HEAD
from .core.db import engine, Base, SessionLocal
from .models.entities import Business
=======
from .core.db import engine, Base
>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
from .api.routes import (
    booster,
    crm,
    automations,
    dashboard,
    whatsapp,
    campaigns,
    reviews,
    gbp,
    onboarding,
    sites,
)
from .jobs.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
<<<<<<< HEAD
    # Auto-create tables for local SQLite; PostgreSQL tables are already created in Supabase
    try:
        if "sqlite" in settings.database_url:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print("[LIFESPAN] Database table init warning:", e)
    
    # Ensure default demo business exists
    try:
        async with SessionLocal() as db:
            demo_b = (await db.execute(select(Business).where(Business.id == "00000000-0000-0000-0000-000000000001"))).scalar_one_or_none()
            if not demo_b:
                demo_b = Business(
                    id="00000000-0000-0000-0000-000000000001",
                    name="Glow & Grace Studio",
                    vertical="salon",
                    phone="+1 (555) 234-5678",
                    plan="ai_team",
                )
                db.add(demo_b)
                await db.commit()
    except Exception as e:
        print("[LIFESPAN] Demo business check warning:", e)

    try:
        scheduler.start()
    except Exception:
        pass
    yield
    try:
        scheduler.shutdown()
    except Exception:
        pass

=======
    # Auto-create tables for local development / SQLite
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    scheduler.start()
    yield
    scheduler.shutdown()

>>>>>>> 3889915 (feat: implement 4 AI agents, services, missing routes, scheduler jobs, and frontend pages)
app = FastAPI(
    title="Golden Reindeer API",
    description="AI Marketing Platform for Small Businesses: 4-agent architecture, shared brain CRM, and flywheel engine.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Golden Reindeer API",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health")
async def health():
    return {"ok": True, "service": "Golden Reindeer API"}

# Include routers
app.include_router(whatsapp.router)  # Handles /webhooks/whatsapp and /api/whatsapp/simulate
app.include_router(booster.router, prefix="/api")
app.include_router(crm.router, prefix="/api")
app.include_router(automations.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(campaigns.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(gbp.router, prefix="/api")
app.include_router(onboarding.router, prefix="/api")
app.include_router(sites.router, prefix="/api")
