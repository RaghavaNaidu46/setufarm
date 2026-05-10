from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/send-otp")
async def send_otp(request: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    """Send OTP to email address"""
    service = AuthService(db)
    await service.send_otp(request.email)
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(request: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    """Verify OTP and return JWT token"""
    service = AuthService(db)
    return await service.verify_otp(request.email, request.otp, request.role)

@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(token: str, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.refresh_token(token)
