from fastapi import APIRouter, Depends, Form, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, update
from app.core.database import get_db
from app.models.all_models import CallSession, Order
from datetime import datetime, timedelta
import pytz

router = APIRouter()

VIRTUAL_NUMBER = "+13203318140"

@router.post("/twiml")
async def handle_call(
    From: str = Form(...),
    To: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Twilio Webhook for incoming calls.
    Decides where to route the call based on active sessions.
    """
    now = datetime.now(pytz.UTC)
    
    # Clean up the incoming number (Twilio format is +91...)
    # We might need to handle formatting depending on how numbers are stored.
    # Let's assume they are stored with country code.
    
    # Check if there is an active session for this caller calling our virtual number
    stmt = select(CallSession).where(
        and_(
            CallSession.virtual_number == To,
            CallSession.is_active == True,
            CallSession.expires_at > now,
            (CallSession.driver_number == From) | (CallSession.customer_number == From)
        )
    )
    res = await db.execute(stmt)
    session = res.scalar_one_or_none()
    
    if not session:
        return Response(
            content='<?xml version="1.0" encoding="UTF-8"?><Response><Say>This session is no longer active. Please check your app for order status.</Say><Hangup/></Response>',
            media_type="application/xml"
        )
    
    # Determine the destination
    # If driver calls, connect to customer. If customer calls, connect to driver.
    destination = session.customer_number if From == session.driver_number else session.driver_number
    
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial callerId="{VIRTUAL_NUMBER}">
        <Number>{destination}</Number>
    </Dial>
</Response>"""

    return Response(content=twiml, media_type="application/xml")

async def create_call_session(db: AsyncSession, order_id, driver_phone, customer_phone):
    # Deactivate any previous sessions for this order
    await db.execute(
        update(CallSession)
        .where(CallSession.order_id == order_id)
        .values(is_active=False)
    )
    
    expires_at = datetime.now(pytz.UTC) + timedelta(minutes=30)
    
    session = CallSession(
        order_id=order_id,
        driver_number=driver_phone,
        customer_number=customer_phone,
        virtual_number=VIRTUAL_NUMBER,
        expires_at=expires_at
    )
    db.add(session)
    await db.commit()
    return session
