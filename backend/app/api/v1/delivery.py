from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.services.order_service import OrderService
from app.schemas.orders import OrderResponse

router = APIRouter()

@router.get("/available", response_model=list[OrderResponse])
async def get_available_deliveries(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get list of orders ready for pickup by drivers"""
    if current_user.role != 'driver' and current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Only drivers can access this")
    service = OrderService(db)
    return await service.get_available_deliveries()

@router.post("/{order_id}/pickup", response_model=OrderResponse)
async def pickup_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Driver marks order as picked up"""
    if current_user.role != 'driver':
        raise HTTPException(status_code=403, detail="Only drivers can pickup orders")
    service = OrderService(db)
    return await service.pickup_order(order_id, current_user.id)
