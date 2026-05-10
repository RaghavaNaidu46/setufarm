import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def drop_all():
    # Use the async URL from settings
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    async with engine.begin() as conn:
        print("Dropping products and related tables...")
        # CASCADE will take care of foreign keys in orders etc.
        await conn.execute(text("DROP TABLE IF EXISTS product_photos CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS products CASCADE;"))
        print("Tables dropped successfully.")

if __name__ == "__main__":
    asyncio.run(drop_all())
