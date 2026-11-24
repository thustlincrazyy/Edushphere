from flask import Blueprint, request, jsonify
from services.chat_service import get_chat_response
from services.auth_service import token_required

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/message", methods=["POST"])
@token_required
def message():
    """
    Accepts conversation history + optional emotion context.
    Returns AI tutor response from Groq.
    
    Request body:
    {
        "messages": [
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."},
            {"role": "user", "content": "latest message"}
        ],
        "emotion": "happy"  // optional
    }
    """
    data = request.get_json()
    messages = data.get("messages", [])
    emotion = data.get("emotion", None)

    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    # Validate message format
    for msg in messages:
        if "role" not in msg or "content" not in msg:
            return jsonify({"error": "Each message needs 'role' and 'content'"}), 400
        if msg["role"] not in ["user", "assistant"]:
            return jsonify({"error": "Role must be 'user' or 'assistant'"}), 400

    try:
        response = get_chat_response(messages, user_emotion=emotion)
        return jsonify({
            "response": response,
            "role": "assistant"
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({"error": "Chat service unavailable"}), 503