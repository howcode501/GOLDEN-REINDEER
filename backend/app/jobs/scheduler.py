from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

async def dummy_job():
    pass

scheduler.add_job(dummy_job, "interval", hours=12)
