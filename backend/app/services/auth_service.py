import random
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.all_models import User, OTPVerification, FarmerProfile, BuyerProfile, DriverProfile
from app.core.security import create_access_token
import logging
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_otp(self, email: str):
        logger.info(f"Attempting to send OTP to: {email}")
        try:
            # Generate OTP
            otp = str(random.randint(100000, 999999))
            expires_at = datetime.utcnow() + timedelta(minutes=5)
            logger.info(f"Generated OTP: {otp} for {email}")


            # Clear old OTPs
            await self.db.execute(delete(OTPVerification).where(OTPVerification.target == email))

            # Save new OTP
            db_otp = OTPVerification(target=email, otp=otp, expires_at=expires_at)
            self.db.add(db_otp)
            await self.db.commit()

            # Send Email
            success = await EmailService.send_otp(email, otp)
            if not success:
                logger.error(f"EmailService failed to send OTP to {email}")
                raise HTTPException(status_code=500, detail="Failed to send email")
                
            logger.info(f"OTP process complete for {email}")
            return True

        except Exception as e:
            logger.error(f"Error in send_otp process: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))



    async def verify_otp(self, email: str, otp: str, role: str):
        # Find OTP
        stmt = select(OTPVerification).where(
            OTPVerification.target == email,
            OTPVerification.otp == otp,
            OTPVerification.expires_at > datetime.utcnow(),
            OTPVerification.is_used == False
        )
        result = await self.db.execute(stmt)
        db_otp = result.scalar_one_or_none()

        if not db_otp:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        # Mark as used
        db_otp.is_used = True

        # Find or create user
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(email=email, role=role)
            self.db.add(user)
            await self.db.flush() # Get user.id

            # Create Profile based on role
            if role == 'farmer':
                profile = FarmerProfile(user_id=user.id)
                self.db.add(profile)
            elif role == 'buyer':
                profile = BuyerProfile(user_id=user.id)
                self.db.add(profile)
            elif role == 'driver':
                profile = DriverProfile(user_id=user.id)
                self.db.add(profile)

        await self.db.commit()
        await self.db.refresh(user)

        # Generate Token
        access_token = create_access_token(subject=user.id)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "role": user.role,
                "name": user.name
            }
        }
