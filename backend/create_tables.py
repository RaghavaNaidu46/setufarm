import asyncio
from app.models.all_models import Base
from app.core.database import engine

async def create_tables():
    async with engine.begin() as conn:
        print("Creating new tables if they don't exist...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

if __name__ == "__main__":
    asyncio.run(create_tables())
