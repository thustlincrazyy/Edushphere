from .db import get_db
from bson import ObjectId
from datetime import datetime

def get_col():
    return get_db()["courses"]

def create_course(title, description, teacher_id, category="General", thumbnail_url=""):
    course = {
        "title": title,
        "description": description,
        "teacher_id": teacher_id,
        "category": category,
        "thumbnail_url": thumbnail_url,
        "enrolled_students": [],
        "created_at": datetime.utcnow()
    }
    result = get_col().insert_one(course)
    return str(result.inserted_id)

def get_all_courses():
    return list(get_col().find())

def get_course_by_id(course_id):
    try:
        return get_col().find_one({"_id": ObjectId(course_id)})
    except:
        return None

def enroll_student(course_id, user_id):
    get_col().update_one(
        {"_id": ObjectId(course_id)},
        {"$addToSet": {"enrolled_students": user_id}}
    )

def serialize_course(course):
    course["_id"] = str(course["_id"])
    if "created_at" in course and isinstance(course["created_at"], datetime):
        course["created_at"] = course["created_at"].isoformat()
    return course
