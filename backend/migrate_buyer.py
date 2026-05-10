import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def migrate():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    async with engine.begin() as conn:
        print("Adding village and state to buyer_profiles...")
        await conn.execute(text("ALTER TABLE buyer_profiles ADD COLUMN IF NOT EXISTS village VARCHAR(100);"))
        await conn.execute(text("ALTER TABLE buyer_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Telangana';"))
        print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate())
