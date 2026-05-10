import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import inspect
from app.core.config import settings

async def check():
    engine = create_async_engine(settings.ASYNC_DATABASE_URL)
    async with engine.connect() as conn:
        def get_tables(connection):
            return inspect(connection).get_table_names()
        
        tables = await conn.run_sync(get_tables)
        print(f"Tables: {tables}")

if __name__ == "__main__":
    asyncio.run(check())
