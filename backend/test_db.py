import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.all_models import BuyerProfile

async def test():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        try:
            profile = BuyerProfile(user_id=" 11111111-1111-1111-1111-111111111111\)
 session.add(profile)
 await session.commit()
 except Exception as e:
 print(e)

if __name__ == \__main__\:
 asyncio.run(test())
