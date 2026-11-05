from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.db import engine, Base
from .api.routes import booster, crm, automations, dashboard
from .jobs.scheduler import scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables for local development/mock
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(title="Golden Reindeer API", lifespan=lifespan)

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

app.include_router(booster.router, prefix="/api")
app.include_router(crm.router, prefix="/api")
app.include_router(automations.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
