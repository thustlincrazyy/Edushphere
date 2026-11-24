import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "edusphere-secret-key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/edusphere")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
    OTP_EXPIRY_MINUTES = 10