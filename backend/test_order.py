import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import Product, Order, User
from app.services.order_service import OrderService
from app.schemas.orders import OrderCreate

async def test():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        try:
            user = await session.execute(select(User).where(User.role == "buyer"))
            buyer = user.scalars().first()
            product = await session.execute(select(Product))
            prod = product.scalars().first()
            
            if not prod or not buyer:
                print("No product or buyer found")
                return
            
            order_req = OrderCreate(product_id=prod.id, quantity_kg=10)
            service = OrderService(session)
            order = await service.create_order(order_req, buyer.id)
            print(f"Order created successfully: {order.id}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
