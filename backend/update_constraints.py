import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def update_db_constraints():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    async with engine.begin() as conn:
        print("Dropping old constraint...")
        await conn.execute(text("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;"))
        print("Adding new constraint with 'draft' status...")
        await conn.execute(text("""
            ALTER TABLE orders ADD CONSTRAINT orders_status_check 
            CHECK (status IN ('draft', 'pending', 'confirmed', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'disputed'));
        """))
        print("Success!")

if __name__ == "__main__":
    asyncio.run(update_db_constraints())
