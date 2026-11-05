from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.db import get_db
from ...core.security import current_ctx, Ctx
from ...schemas.schemas import AutomationToggle
from ...models.entities import BusinessAutomation

router = APIRouter(prefix="/automations", tags=["Automation Store"])

@router.get("")
async def get_automations(ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(BusinessAutomation).where(BusinessAutomation.business_id == ctx.business_id)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.put("")
async def set_automation(req: AutomationToggle, ctx: Ctx = Depends(current_ctx), db: AsyncSession = Depends(get_db)):
    stmt = select(BusinessAutomation).where(
        BusinessAutomation.business_id == ctx.business_id,
        BusinessAutomation.key == req.key
    )
    res = await db.execute(stmt)
    entry = res.scalar_one_or_none()
    if entry:
        entry.enabled = req.enabled
        if req.config is not None:
            entry.config = req.config
    else:
        entry = BusinessAutomation(
            business_id=ctx.business_id,
            key=req.key,
            enabled=req.enabled,
            config=req.config or {},
        )
        db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
