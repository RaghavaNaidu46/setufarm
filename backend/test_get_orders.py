import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import User
from app.services.order_service import OrderService

async def test_get_orders():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        # Get Aravind buyer
        res = await session.execute(select(User).where(User.phone == "7093397835"))
        user = res.scalar_one_or_none()
        if not user:
            print("User not found")
            return
        
        print(f"Testing for User ID: {user.id}, Role: {user.role}")
        service = OrderService(session)
        orders = await service.get_my_orders(user.id, user.role)
        print(f"Found {len(orders)} orders")
        for o in orders:
            print(f"Order: {o.id}, Crop: {o.crop_name}, Total: {o.total_amount}")

if __name__ == "__main__":
    asyncio.run(test_get_orders())
