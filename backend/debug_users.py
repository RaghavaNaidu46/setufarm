import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.models.all_models import User

async def check_users():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        res = await session.execute(select(User))
        users = res.scalars().all()
        for u in users:
            print(f"User: {u.phone}, Role: {u.role}, ID: {u.id}, Name: {u.name}")

if __name__ == "__main__":
    asyncio.run(check_users())
