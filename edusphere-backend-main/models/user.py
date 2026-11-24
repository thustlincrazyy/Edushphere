from .db import get_db
from bson import ObjectId
import bcrypt
from datetime import datetime

def get_col():
    return get_db()["users"]

def create_user(data):
    data["password"] = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()
    data["is_verified"] = False
    data["created_at"] = datetime.utcnow()
    result = get_col().insert_one(data)
    return str(result.inserted_id)

def find_user_by_email(email):
    return get_col().find_one({"email": email})

def find_user_by_id(user_id):
    return get_col().find_one({"_id": ObjectId(user_id)})

def update_user(email, update_data):
    get_col().update_one({"email": email}, {"$set": update_data})

def verify_password(plain, hashed):
    if isinstance(hashed, str):
        hashed = hashed.encode()
    return bcrypt.checkpw(plain.encode(), hashed)
