import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import Order, Product

async def check_data():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        # Check orders
        res = await session.execute(select(Order))
        orders = res.scalars().all()
        print(f"Total Orders: {len(orders)}")
        
        for o in orders:
            prod_res = await session.execute(select(Product).where(Product.id == o.product_id))
            prod = prod_res.scalar_one_or_none()
            if not prod:
                print(f"Order {o.id} references missing Product {o.product_id}")
            else:
                print(f"Order {o.id} is for Product {prod.crop_name}")

if __name__ == "__main__":
    asyncio.run(check_data())
