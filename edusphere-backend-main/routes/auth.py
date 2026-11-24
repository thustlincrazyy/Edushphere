from flask import Blueprint, request, jsonify
from models.user import create_user, find_user_by_email, update_user, verify_password
from services.email_service import generate_otp, get_otp_expiry, send_otp_email
from services.auth_service import generate_token, token_required
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data or not data.get("email") or not data.get("password") or not data.get("name"):
        return jsonify({"error": "Missing required fields"}), 400
    
    if find_user_by_email(data["email"]):
        return jsonify({"error": "User already exists"}), 400
    
    # Create user with initial dummy stats
    user_id = create_user({
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "role": data.get("role", "student"),
        "student_stats": {
            "attendance": 0,
            "avg_score": 0,
            "engagement": 0,
            "attendance_dates": [],
            "quiz_scores": [],
            "weekly_active_minutes": 0,
            "last_active": datetime.utcnow()
        }
    })
    
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = find_user_by_email(data.get("email"))
    
    if user and verify_password(data.get("password"), user["password"]):
        # Update attendance on login
        from models.db import get_db
        db = get_db()
        today = datetime.utcnow().strftime("%Y-%m-%d")
        db["users"].update_one(
            {"email": user["email"]},
            {"$addToSet": {"student_stats.attendance_dates": today}}
        )
        
        token = generate_token(str(user["_id"]), user["email"], user["role"])
        return jsonify({
            "token": token,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile(current_user):
    stats = current_user.get("student_stats", {})
    
    # Calculate Live Stats
    # 1. Attendance (Monthly %)
    attendance_dates = stats.get("attendance_dates", [])
    current_month = datetime.utcnow().strftime("%Y-%m")
    this_month_dates = [d for d in attendance_dates if d.startswith(current_month)]
    attendance_pct = min(100, round((len(this_month_dates) / 20) * 100))
    
    # 2. Avg Score
    quiz_scores = stats.get("quiz_scores", [])
    avg_score = round(sum(quiz_scores) / len(quiz_scores)) if quiz_scores else 0
    
    # 3. Engagement (Weekly target: 600 mins)
    weekly_mins = stats.get("weekly_active_minutes", 0)
    engagement_pct = min(100, round((weekly_mins / 600) * 100))
    
    return jsonify({
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "student_stats": {
            "attendance": attendance_pct,
            "avg_score": avg_score,
            "engagement": engagement_pct
        }
    }), 200

@auth_bp.route("/heartbeat", methods=["POST"])
@token_required
def heartbeat(current_user):
    from models.db import get_db
    db = get_db()
    
    now = datetime.utcnow()
    last_active = current_user.get("student_stats", {}).get("last_active")
    
    if last_active:
        diff = (now - last_active).total_seconds() / 60
        if diff < 5:
            db["users"].update_one(
                {"_id": current_user["_id"]},
                {"$inc": {"student_stats.weekly_active_minutes": diff}}
            )
            
    db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$set": {"student_stats.last_active": now}}
    )
    return jsonify({"status": "ok"}), 200

@auth_bp.route("/update-stats", methods=["POST"])
@token_required
def update_stats(current_user):
    data = request.json
    game_score = data.get("game_score", 0)
    
    from models.db import get_db
    db = get_db()
    
    db["users"].update_one(
        {"_id": current_user["_id"]},
        {"$push": {"student_stats.quiz_scores": game_score}}
    )
    
    updated_user = db["users"].find_one({"_id": current_user["_id"]})

    # Recalculate stats inline
    stats = updated_user.get("student_stats", {})
    current_month = datetime.utcnow().strftime("%Y-%m")
    attendance_dates = stats.get("attendance_dates", [])
    this_month_dates = [d for d in attendance_dates if d.startswith(current_month)]
    attendance_pct = min(100, round((len(this_month_dates) / 20) * 100))
    quiz_scores = stats.get("quiz_scores", [])
    avg_score = round(sum(quiz_scores) / len(quiz_scores)) if quiz_scores else 0
    weekly_mins = stats.get("weekly_active_minutes", 0)
    engagement_pct = min(100, round((weekly_mins / 600) * 100))

    return jsonify({
        "name": updated_user["name"],
        "email": updated_user["email"],
        "role": updated_user["role"],
        "student_stats": {
            "attendance": attendance_pct,
            "avg_score": avg_score,
            "engagement": engagement_pct
        }
    }), 200

@auth_bp.route("/teacher-analytics", methods=["GET"])
@token_required
def teacher_analytics(current_user):
    if current_user.get("role") != "teacher":
        return jsonify({"error": "Unauthorized"}), 403
        
    from models.db import get_db
    db = get_db()
    
    students = list(db["users"].find({"role": "student"}))
    
    if not students:
        return jsonify({
            "avg_attendance": 0, "avg_score": 0, "avg_engagement": 0,
            "total_students": 0, "students": []
        }), 200
        
    formatted_students = []
    total_att = 0
    total_score = 0
    total_eng = 0
    current_month = datetime.utcnow().strftime("%Y-%m")

    for s in students:
        stats = s.get("student_stats", {})
        attendance_dates = stats.get("attendance_dates", [])
        this_month_dates = [d for d in attendance_dates if d.startswith(current_month)]
        live_att = min(100, round((len(this_month_dates) / 20) * 100)) if this_month_dates else 0
        
        quiz_scores = stats.get("quiz_scores", [])
        live_score = round(sum(quiz_scores) / len(quiz_scores)) if quiz_scores else 0
        
        weekly_mins = stats.get("weekly_active_minutes", 0)
        live_eng = min(100, round((weekly_mins / 600) * 100))
        
        total_att += live_att
        total_score += live_score
        total_eng += live_eng
        
        status = "Excellent" if live_score >= 90 else "On Track" if live_score >= 70 else "At Risk"
        formatted_students.append({
            "name": s.get("name", "Unknown"),
            "score": live_score,
            "attendance": live_att,
            "engagement": live_eng,
            "status": status
        })
    
    count = len(students)
    return jsonify({
        "avg_attendance": round(total_att / count),
        "avg_score": round(total_score / count),
        "avg_engagement": round(total_eng / count),
        "total_students": count,
        "students": formatted_students
    }), 200

@auth_bp.route("/leaderboard", methods=["GET"])
def leaderboard():
    from models.db import get_db
    db = get_db()
    users_collection = db["users"]
    
    students = list(users_collection.find(
        {"role": "student"},
        {"name": 1, "student_stats": 1, "_id": 0}
    ).sort("student_stats.weekly_active_minutes", -1).limit(10))
    
    formatted = []
    for s in students:
        stats = s.get("student_stats", {})
        weekly_mins = stats.get("weekly_active_minutes", 0)
        live_eng = min(100, round((weekly_mins / 600) * 100))
        quiz_scores = stats.get("quiz_scores", [])
        live_score = round(sum(quiz_scores) / len(quiz_scores)) if quiz_scores else 0
        
        formatted.append({
            "name": s.get("name", "Unknown"),
            "engagement": live_eng,
            "score": live_score
        })
        
    return jsonify({"leaderboard": formatted}), 200
