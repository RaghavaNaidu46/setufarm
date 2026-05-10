import asyncio
from sqlalchemy import text
from app.core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Running migration...")
        try:
            await conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address_text TEXT"))
            await conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS gst_amount DECIMAL(8, 2) DEFAULT 0"))
            await conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS service_fee DECIMAL(8, 2) DEFAULT 0"))
            print("Added missing columns to orders")
            
            # Create buyer_addresses table (though startup should do this, let's be safe)
            # But Base.metadata.create_all handles new tables fine.
            # It's only existing tables that need ALTER.
            
        except Exception as e:
            print(f"Migration error: {e}")
        
        print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
