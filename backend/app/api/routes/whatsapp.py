import hmac
import hashlib
import logging
from fastapi import APIRouter, Request, Response, HTTPException, BackgroundTasks, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.config import settings
from ...core.db import get_db
from ...services.chat_agent import handle_inbound

router = APIRouter(tags=["WhatsApp AI Agent & Webhooks"])
logger = logging.getLogger("golden_reindeer.whatsapp_route")

@router.get("/webhooks/whatsapp")
async def verify_webhook(
    mode: str = Query(alias="hub.mode"),
    token: str = Query(alias="hub.verify_token"),
    challenge: str = Query(alias="hub.challenge"),
):
    """Meta Cloud API webhook handshake verification."""
    if mode == "subscribe" and token == settings.wa_verify_token:
        return Response(content=challenge, media_type="text/plain")
    raise HTTPException(403, "Invalid webhook verification token")

@router.post("/webhooks/whatsapp")
async def inbound_webhook(request: Request, bg: BackgroundTasks):
    """
    Receives inbound customer messages and status receipts from Meta WhatsApp Cloud API.
    Verifies HMAC signature when WA_APP_SECRET is configured.
    """
    raw_body = await request.body()
    sig = request.headers.get("X-Hub-Signature-256", "")
    
    # Verify HMAC signature if secret is provided in production
    if settings.wa_app_secret and not settings.wa_app_secret.startswith("mock_"):
        expected = "sha256=" + hmac.new(settings.wa_app_secret.encode(), raw_body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            raise HTTPException(403, "Invalid webhook HMAC signature")

    payload = await request.json()
    # Process message in background to reply with fast 200 OK to Meta
    bg.add_task(handle_inbound, payload)
    return {"ok": True}

@router.post("/api/whatsapp/simulate")
async def simulate_inbound(payload: dict):
    """
    Direct simulation endpoint for testing the WhatsApp AI agent conversation
    without needing a live Meta Cloud API account or webhook tunnel.
    """
    result = await handle_inbound(payload)
    return result
