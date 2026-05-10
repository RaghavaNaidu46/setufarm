import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import User, Product
from app.services.order_service import OrderService
from pydantic import BaseModel
from uuid import UUID

class MockOrderCreate(BaseModel):
    product_id: UUID
    quantity_kg: float

async def test_create_order():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        # Get a buyer
        stmt = select(User).where(User.role == "buyer")
        res = await session.execute(stmt)
        user = res.scalars().first()
        
        # Get a product
        stmt = select(Product)
        res = await session.execute(stmt)
        product = res.scalars().first()
        
        if not user or not product:
            print("User or Product not found")
            return
            
        print(f"Creating order for User: {user.id}, Product: {product.id}")
        service = OrderService(session)
        order_data = MockOrderCreate(product_id=product.id, quantity_kg=10.0)
        
        try:
            new_order = await service.create_order(order_data, user.id)
            print(f"Order created successfully: {new_order.id}, status: {new_order.status}")
        except Exception as e:
            print(f"FAILED to create order: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_create_order())
