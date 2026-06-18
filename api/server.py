

import hashlib
import os
import time

import mysql.connector
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Ynov CI API")

# CORS : le front (github pages / localhost) doit pouvoir appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Configuration ───────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "db"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("MYSQL_ROOT_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "ynov_ci"),
    "port": int(os.getenv("DB_PORT", "3306")),
}

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "loise.fenoll@ynov.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "PvdrTAzTeR247sDnAZBr")
# Jeton renvoyé après connexion admin et exigé sur les routes protégées
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "ynov-admin-token")


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ─── Schémas ─────────────────────────────────────────────────────────────────────
class UserIn(BaseModel):
    nom: str
    prenom: str | None = None
    email: str
    dateDeNaissance: str | None = None
    ville: str | None = None
    codePostal: str | None = None


class Login(BaseModel):
    email: str
    password: str


# ─── Sécurité ────────────────────────────────────────────────────────────────────
def require_admin(authorization: str = Header(default="")):
    """Valide le jeton admin (header Authorization: Bearer <token>)."""
    expected = f"Bearer {ADMIN_TOKEN}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Accès administrateur requis")
    return True


# ─── Initialisation : compte admin au démarrage ──────────────────────────────────
def seed_admin():
    """Ajoute l'administrateur s'il n'existe pas déjà (identifiants via env)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM utilisateur WHERE email = %s", (ADMIN_EMAIL,))
    if cursor.fetchone() is None:
        cursor.execute(
            """INSERT INTO utilisateur (nom, prenom, email, password, is_admin)
               VALUES (%s, %s, %s, %s, TRUE)""",
            ("Admin", "Ynov", ADMIN_EMAIL, hash_password(ADMIN_PASSWORD)),
        )
        conn.commit()
    cursor.close()
    conn.close()


@app.on_event("startup")
def on_startup():
    # La DB peut mettre quelques instants à accepter les connexions TCP
    for attempt in range(15):
        try:
            seed_admin()
            print("[startup] admin seedé / déjà présent")
            return
        except Exception as exc:  # pragma: no cover - dépend de la dispo de la DB
            print(f"[startup] seed_admin tentative {attempt + 1} : {exc}")
            time.sleep(2)



router = APIRouter(prefix="/api")


@app.get("/")
def health():
    """Endpoint de santé (utilisé par le healthcheck docker)."""
    return {"status": "ok"}


@router.get("/users")
def list_users():
    """Liste publique : informations réduites, sans les admins."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nom, prenom, ville FROM utilisateur WHERE is_admin = FALSE"
    )
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users


@router.get("/dbcheck")
def db_check():
    """Diagnostic : teste la connexion DB et renvoie l'erreur exacte si échec.
    (À retirer une fois la prod validée.)"""
    info = {
        "DB_HOST": DB_CONFIG["host"],
        "DB_NAME": DB_CONFIG["database"],
        "DB_USER": DB_CONFIG["user"],
        "DB_PORT": DB_CONFIG["port"],
    }
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM utilisateur")
        (count,) = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"ok": True, "users_count": count, "config": info}
    except Exception as exc:
        return {"ok": False, "error": str(exc), "config": info}


@router.get("/users/count")
def count_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM utilisateur WHERE is_admin = FALSE")
    (count,) = cursor.fetchone()
    cursor.close()
    conn.close()
    return {"count": count}


@router.post("/users", status_code=201)
def register_user(user: UserIn):
    """Inscription publique : sauvegarde en base."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO utilisateur
               (nom, prenom, email, date_naissance, ville, code_postal, is_admin)
               VALUES (%s, %s, %s, %s, %s, %s, FALSE)""",
            (
                user.nom,
                user.prenom,
                user.email,
                user.dateDeNaissance or None,
                user.ville,
                user.codePostal,
            ),
        )
        conn.commit()
        new_id = cursor.lastrowid
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Email déjà inscrit")
    finally:
        cursor.close()
        conn.close()
    return {"id": new_id, "nom": user.nom, "prenom": user.prenom, "ville": user.ville}


@router.post("/login")
def login(creds: Login):
    """Connexion administrateur : renvoie un jeton si les identifiants sont valides."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT password FROM utilisateur WHERE email = %s AND is_admin = TRUE",
        (creds.email,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row is None or row["password"] != hash_password(creds.password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return {"token": ADMIN_TOKEN}


@router.get("/users/{user_id}")
def get_user(user_id: int, _: bool = Depends(require_admin)):
    """Informations privées complètes d'un utilisateur (admin uniquement)."""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """SELECT id, nom, prenom, email, date_naissance, ville, code_postal, created_at
           FROM utilisateur WHERE id = %s""",
        (user_id,),
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if user.get("date_naissance") is not None:
        user["date_naissance"] = str(user["date_naissance"])
    if user.get("created_at") is not None:
        user["created_at"] = str(user["created_at"])
    return user


@router.delete("/users/{user_id}")
def delete_user(user_id: int, _: bool = Depends(require_admin)):
    """Suppression d'un utilisateur (admin uniquement)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM utilisateur WHERE id = %s AND is_admin = FALSE", (user_id,)
    )
    conn.commit()
    deleted = cursor.rowcount
    cursor.close()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return {"deleted": user_id}


# Monte toutes les routes /api/* sur l'application
app.include_router(router)
