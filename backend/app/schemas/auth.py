from pydantic import BaseModel

class SendOTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
