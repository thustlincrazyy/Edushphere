FROM python:3.10.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libxcb1 \
    libxcb-util1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD gunicorn "app:create_app()" --bind 0.0.0.0:$PORT
