from fastapi import APIRouter, Depends, Query, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.products import ProductCreate, ProductResponse, ProductListResponse
from app.services.product_service import ProductService

router = APIRouter()

@router.post("", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Farmer lists a new crop for sale"""
    service = ProductService(db)
    result = await service.create_product(product, current_user.id)
    return service._serialize_product(result)


@router.post("/voice-listing")
async def voice_listing(
    audio: UploadFile = File(...),
    language: str = "telugu",
    current_user = Depends(get_current_user)
):
    """Convert farmer voice to product listing using Google Speech API"""
    service = ProductService(None)
    result = await service.process_voice_listing(audio, language)
    return result

@router.get("/nearby", response_model=ProductListResponse)
async def get_nearby_products(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(default=20),
    crop_type: str = Query(default=None),
    min_price: float = Query(default=None),
    max_price: float = Query(default=None),
    db: AsyncSession = Depends(get_db)
):
    """Get products near buyer location"""
    service = ProductService(db)
    return await service.get_nearby_products(lat, lng, radius_km, crop_type, min_price, max_price)

@router.get("/market-price/{crop_name}")
async def get_market_price(crop_name: str, district: str = None, db: AsyncSession = Depends(get_db)):
    """Get today's market price for a crop"""
    service = ProductService(db)
    return await service.get_market_price(crop_name, district)

@router.get("/my-listings", response_model=ProductListResponse)
async def my_listings(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ProductService(db)
    return await service.get_farmer_listings(current_user.id)

@router.patch("/{product_id}/status")
async def update_product_status(
    product_id: str,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ProductService(db)
    return await service.update_status(product_id, status, current_user.id)
