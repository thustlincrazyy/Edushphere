from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.emotion import emotion_bp
from routes.chat import chat_bp
from routes.courses import courses_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app,
     origins=["https://edusphere-ashy.vercel.app", "http://localhost:5173"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(emotion_bp, url_prefix="/api/emotion")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(courses_bp, url_prefix="/api/courses")

    @app.route("/")
    def health():
        return {"status": "EduSphere backend is running"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
