from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.all_models import User, BuyerAddress
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse

router = APIRouter()

@router.post("/", response_model=AddressResponse)
async def create_address(
    address_data: AddressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != 'buyer':
        raise HTTPException(status_code=400, detail="Only buyers can manage addresses")

    # If this is the first address, make it default
    stmt = select(BuyerAddress).where(BuyerAddress.user_id == current_user.id)
    res = await db.execute(stmt)
    existing_addresses = res.scalars().all()
    
    is_default = address_data.is_default or not existing_addresses

    # If making this default, unset other defaults
    if is_default:
        await db.execute(
            update(BuyerAddress)
            .where(BuyerAddress.user_id == current_user.id)
            .values(is_default=False)
        )

    new_address = BuyerAddress(
        user_id=current_user.id,
        label=address_data.label,
        address_line=address_data.address_line,
        village=address_data.village,
        district=address_data.district,
        state=address_data.state,
        pincode=address_data.pincode,
        lat=address_data.lat,
        lng=address_data.lng,
        is_default=is_default
    )
    db.add(new_address)
    await db.commit()
    await db.refresh(new_address)
    return new_address

@router.get("/", response_model=List[AddressResponse])
async def list_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(BuyerAddress).where(BuyerAddress.user_id == current_user.id).order_by(BuyerAddress.is_default.desc(), BuyerAddress.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: UUID,
    address_data: AddressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(BuyerAddress).where(BuyerAddress.id == address_id, BuyerAddress.user_id == current_user.id)
    res = await db.execute(stmt)
    address = res.scalar_one_or_none()
    
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    update_data = address_data.model_dump(exclude_unset=True)
    
    if update_data.get('is_default'):
        await db.execute(
            update(BuyerAddress)
            .where(BuyerAddress.user_id == current_user.id)
            .values(is_default=False)
        )

    for key, value in update_data.items():
        setattr(address, key, value)
    
    await db.commit()
    await db.refresh(address)
    return address

@router.delete("/{address_id}")
async def delete_address(
    address_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = delete(BuyerAddress).where(BuyerAddress.id == address_id, BuyerAddress.user_id == current_user.id)
    res = await db.execute(stmt)
    await db.commit()
    
    if res.rowcount == 0:
        raise HTTPException(status_code=404, detail="Address not found")
        
    return {"message": "Address deleted"}
