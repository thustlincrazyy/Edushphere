from flask import Blueprint, request, jsonify
from services.emotion_service import analyze_emotion
from services.auth_service import token_required
from models.db import get_db
from datetime import datetime

emotion_bp = Blueprint("emotion", __name__)

@emotion_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    Receives a base64-encoded image from the frontend webcam.
    Returns dominant emotion + scores.
    """
    data = request.get_json()
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No image provided"}), 400

    # Call the new MediaPipe Engagement detector
    result = analyze_emotion(image_data)

    return jsonify(result), 200

@emotion_bp.route("/history", methods=["GET"])
@token_required
def emotion_history():
    """Return last 20 emotion logs for the current user."""
    user_id = request.current_user.get("user_id")
    from models.user import find_user_by_id
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    logs = user.get("emotion_logs", [])[-20:]
    # Convert datetime to string
    for log in logs:
        if isinstance(log.get("timestamp"), datetime):
            log["timestamp"] = log["timestamp"].isoformat()

    return jsonify({"emotion_logs": logs}), 200