import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.all_models import BuyerProfile, User

async def test():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        try:
            # Create a user first to avoid FK constraint violation
            new_user_id = uuid.uuid4()
            user = User(id=new_user_id, email=f"test{new_user_id}@test.com", role="buyer")
            session.add(user)
            await session.flush()
            
            profile = BuyerProfile(user_id=new_user_id)
            session.add(profile)
            await session.commit()
            print("Successfully inserted BuyerProfile with NULL business_type")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
