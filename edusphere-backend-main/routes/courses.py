from flask import Blueprint, request, jsonify
from models.course import (
    create_course, get_all_courses, get_course_by_id,
    enroll_student, serialize_course
)
from models.user import find_user_by_id, update_user
from services.auth_service import token_required, role_required

courses_bp = Blueprint("courses", __name__)

@courses_bp.route("/", methods=["GET"])
def list_courses():
    """Public: get all courses."""
    courses = get_all_courses()
    return jsonify({"courses": [serialize_course(c) for c in courses]}), 200

@courses_bp.route("/<course_id>", methods=["GET"])
def get_course(course_id):
    """Public: get single course details."""
    course = get_course_by_id(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    return jsonify(serialize_course(course)), 200

@courses_bp.route("/", methods=["POST"])
@token_required
def create_new_course():
    """Teacher/Admin only: create a new course."""
    user = request.current_user
    if user.get("role") not in ["teacher", "admin"]:
        return jsonify({"error": "Only teachers can create courses"}), 403

    data = request.get_json()
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    category = data.get("category", "General")
    thumbnail_url = data.get("thumbnail_url", "")

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    course_id = create_course(
        title=title,
        description=description,
        teacher_id=user["user_id"],
        category=category,
        thumbnail_url=thumbnail_url
    )

    return jsonify({
        "message": "Course created successfully",
        "course_id": course_id
    }), 201

@courses_bp.route("/<course_id>/enroll", methods=["POST"])
@token_required
def enroll(course_id):
    """Student: enroll in a course."""
    user_id = request.current_user.get("user_id")
    email = request.current_user.get("email")

    course = get_course_by_id(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    enroll_student(course_id, user_id)
    update_user(email, {"$addToSet": {"enrolled_courses": course_id}})

    return jsonify({"message": f"Enrolled in '{course['title']}' successfully"}), 200

@courses_bp.route("/my-courses", methods=["GET"])
@token_required
def my_courses():
    """Student: get enrolled courses."""
    user_id = request.current_user.get("user_id")
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    enrolled_ids = user.get("enrolled_courses", [])
    courses = []
    for cid in enrolled_ids:
        c = get_course_by_id(cid)
        if c:
            courses.append(serialize_course(c))

    return jsonify({"courses": courses}), 200