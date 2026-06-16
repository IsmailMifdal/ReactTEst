# Image du serveur API Python (FastAPI)
FROM python:3.12-alpine

WORKDIR /app

# curl est nécessaire pour le healthcheck (vérification d'un code HTTP précis)
RUN apk add --no-cache curl

# Installation des dépendances en premier pour profiter du cache de couches
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code de l'application
COPY server.py .

# Port exposé par uvicorn
EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
