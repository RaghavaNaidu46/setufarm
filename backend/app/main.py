from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, users, products, orders, payments, delivery, admin, addresses, calls


from app.core.config import settings
from app.core.database import engine, Base
from app.models import all_models # Ensure all models are loaded

app = FastAPI(title=settings.APP_NAME, version=settings.VERSION)

@app.on_event("startup")
async def startup():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/v1/auth",     tags=["Auth"])
app.include_router(users.router,    prefix="/api/v1/users",    tags=["Users"])
app.include_router(calls.router,    prefix="/api/v1/calls",    tags=["Calls"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(orders.router,   prefix="/api/v1/orders",   tags=["Orders"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(delivery.router, prefix="/api/v1/delivery", tags=["Delivery"])
app.include_router(admin.router,    prefix="/api/v1/admin",    tags=["Admin"])
app.include_router(addresses.router, prefix="/api/v1/addresses", tags=["Addresses"])


@app.get("/health")

async def health():
    return {"status": "ok", "version": settings.VERSION}
