import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.db import engine, Base

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json() == {"ok": True, "service": "Golden Reindeer API"}

@pytest.mark.asyncio
async def test_free_booster_audit():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"business_name": "Glow Luxury Salon", "phone": "+919811122233"}
        res = await ac.post("/api/booster/audit", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "score" in data
        assert "issues" in data
        assert "competitors" in data
        assert len(data["checklist"]) >= 8

@pytest.mark.asyncio
async def test_crm_contact_and_flywheel():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create a contact
        contact_res = await ac.post("/api/contacts", json={
            "name": "Priya Sharma",
            "phone": "+919988776655",
            "stage": "lead",
            "source": "whatsapp",
            "opted_in": True,
            "tags": ["vip", "bridal"]
        })
        assert contact_res.status_code == 200
        contact = contact_res.json()
        contact_id = contact["id"]

        # 2. Record a purchase (Flywheel event: purchase.recorded)
        purchase_res = await ac.post("/api/purchases", json={
            "contact_id": contact_id,
            "item": "Deluxe Hydra-Facial Package",
            "amount": 4500.0,
        })
        assert purchase_res.status_code == 200
        purchase = purchase_res.json()
        assert purchase["amount"] == 4500.0

@pytest.mark.asyncio
async def test_automation_store_toggles():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Toggle review_requests switch
        toggle_res = await ac.put("/api/automations", json={
            "key": "review_requests",
            "enabled": True,
            "config": {"delay_hours": 24}
        })
        assert toggle_res.status_code == 200
        data = toggle_res.json()
        assert data["key"] == "review_requests"
        assert data["enabled"] is True

@pytest.mark.asyncio
async def test_whatsapp_agent_simulation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        sim_res = await ac.post("/api/whatsapp/simulate", json={
            "phone": "+919876543210",
            "name": "Ananya Roy",
            "message": "Hi, what is the price for bridal package?"
        })
        assert sim_res.status_code == 200
        data = sim_res.json()
        assert data["status"] == "success"
        assert len(data["reply"]) > 10

@pytest.mark.asyncio
async def test_google_gbp_keywords_and_posts():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        kw_res = await ac.post("/api/gbp/keywords", json={
            "business_name": "Royal Cuts",
            "vertical": "salon",
            "city": "Mumbai"
        })
        assert kw_res.status_code == 200
        keywords = kw_res.json()
        assert len(keywords) >= 3
