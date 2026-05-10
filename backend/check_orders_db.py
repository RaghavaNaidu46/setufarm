import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import Order, User

async def check_orders():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        # Check users
        user_res = await session.execute(select(User))
        users = user_res.scalars().all()
        print("--- Users ---")
        for u in users:
            print(f"ID: {u.id}, Role: {u.role}, Name: {u.name}")

        # Check orders
        res = await session.execute(select(Order))
        orders = res.scalars().all()
        print("\n--- Orders ---")
        if not orders:
            print("No orders found in database")
        for o in orders:
            print(f"ID: {o.id}, Buyer: {o.buyer_id}, Farmer: {o.farmer_id}, Status: {o.status}")

if __name__ == "__main__":
    asyncio.run(check_orders())
