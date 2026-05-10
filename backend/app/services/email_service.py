import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    async def send_otp(email: str, otp: str):
        """Send OTP to user's email using SMTP."""
        
        # if not configured, fallback to mock (or log warning)
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.warning("SMTP credentials not configured. Falling back to mock email.")
            print(f"--- MOCK EMAIL ---")
            print(f"To: {email}")
            print(f"Subject: SetuFarm Login OTP")
            print(f"Body: Your OTP for SetuFarm is {otp}. It expires in 5 minutes.")
            print(f"------------------")
            return True

        message = MIMEMultipart("alternative")
        message["Subject"] = "SetuFarm Login OTP"
        message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        message["To"] = email

        # plain text version
        text = f"Your OTP for SetuFarm is {otp}. It expires in 5 minutes."
        
        # html version
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2e7d32;">SetuFarm Authentication</h2>
                    <p>Hello,</p>
                    <p>Your one-time password (OTP) for logging into SetuFarm is:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                        {otp}
                    </div>
                    <p>This OTP will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">&copy; 2026 SetuFarm. All rights reserved.</p>
                </div>
            </body>
        </html>
        """

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)

        try:
            logger.info(f"Connecting to SMTP {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                start_tls=(settings.SMTP_PORT == 587),
                use_tls=(settings.SMTP_PORT == 465),
            )
            logger.info(f"OTP sent successfully to {email}")
            return True
        except Exception as e:
            logger.error(f"SMTP ERROR for {email}: {type(e).__name__}: {str(e)}")
            return False

