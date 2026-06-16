import os

import mysql.connector
from fastapi import FastAPI

app = FastAPI()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("MYSQL_ROOT_PASSWORD", ""),
        database=os.getenv("DB_NAME", "ynov_ci"),
    )


@app.get("/")
def nombre_utilisateurs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM utilisateur")
    (count,) = cursor.fetchone()
    cursor.close()
    conn.close()
    return {"nombre_utilisateurs": count}
