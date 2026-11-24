import os
from groq import Groq

client = None

def get_groq_client():
    global client
    if client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not set in .env")
        client = Groq(api_key=api_key)
    return client

SYSTEM_PROMPT = """You are EduBot, an intelligent AI tutor for EduSphere — an online learning platform.
Your role:
- Help students understand course concepts clearly
- Answer questions about subjects being studied
- Give encouragement and study tips
- Adapt explanations to the student's level
- Keep responses concise, friendly, and educational

You DO NOT:
- Answer questions unrelated to learning/education
- Give harmful or inappropriate content
- Pretend to be a human

Always end with a follow-up question or encouragement to keep the student engaged."""

def get_chat_response(messages, user_emotion=None):
    groq = get_groq_client()

    system = SYSTEM_PROMPT
    if user_emotion and user_emotion not in ["neutral", "unknown"]:
        system += f"\n\nNote: The student currently appears to be feeling '{user_emotion}'. Adjust your tone accordingly — be extra supportive if sad/angry, energetic if happy."

    formatted = [{"role": "system", "content": system}]
    for msg in messages:
        formatted.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    response = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=formatted,
        max_tokens=500,
        temperature=0.7
    )

    return response.choices[0].message.content
