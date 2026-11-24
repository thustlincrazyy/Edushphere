import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os

def generate_otp(length=6):
    return "".join(random.choices(string.digits, k=length))

def get_otp_expiry(minutes=10):
    return datetime.utcnow() + timedelta(minutes=minutes)

def send_otp_email(to_email, otp_code, user_name="Student"):
    sender_email = os.getenv("MAIL_USERNAME")
    sender_password = os.getenv("MAIL_PASSWORD")

    if not sender_email or not sender_password:
        print("⚠️  Email credentials not set — OTP:", otp_code)
        return True  # Dev mode: skip actual sending

    subject = "EduSphere — Your Verification Code"
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #4f46e5;">EduSphere 🎓</h2>
        <p>Hi <strong>{user_name}</strong>,</p>
        <p>Your email verification code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                    color: #4f46e5; text-align: center; padding: 20px;
                    background: #f0f0ff; border-radius: 8px; margin: 20px 0;">
            {otp_code}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #999;">If you didn't request this, ignore this email.</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        print(f"✅ OTP email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Email send failed: {e}")
        return False