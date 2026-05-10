from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.schemas.orders import OrderCreate, OrderResponse, DeliveryOptionRequest, DeliveryProofRequest
from app.services.order_service import OrderService

router = APIRouter()

@router.post("", response_model=OrderResponse)
async def create_order(
    order: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Buyer places an order"""
    service = OrderService(db)
    return await service.create_order(order, current_user.id)

@router.get("/my-orders", response_model=list[OrderResponse])
async def my_orders(
    role: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get list of orders for current user based on role"""
    service = OrderService(db)
    return await service.get_my_orders(current_user.id, role)

@router.get("/delivery-options/{product_id}")
async def get_delivery_options(
    product_id: str,
    buyer_lat: float,
    buyer_lng: float,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all 3 delivery options for an order:
    1. Driver delivers (GramFleet)
    2. Farmer delivers (if farmer willing)
    3. Buyer self pickup
    """
    service = OrderService(db)
    return await service.get_delivery_options(product_id, buyer_lat, buyer_lng)

@router.post("/{order_id}/select-delivery")
async def select_delivery_option(
    order_id: str,
    option: DeliveryOptionRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Buyer selects delivery option — driver / farmer / self pickup"""
    service = OrderService(db)
    return await service.select_delivery(order_id, option, current_user.id)

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update order status (confirmed, ready_for_pickup, etc)"""
    service = OrderService(db)
    return await service.update_status(order_id, status, current_user.id)

@router.post("/{order_id}/delivery-proof")
async def upload_delivery_proof(
    order_id: str,
    proof: DeliveryProofRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Driver or farmer uploads delivery photo as proof"""
    service = OrderService(db)
    return await service.upload_delivery_proof(order_id, proof.photo_url, proof.lat, proof.lng, current_user.id)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get details of a specific order. MUST BE AFTER STATIC ROUTES."""
    service = OrderService(db)
    return await service.get_order(order_id, current_user.id)
