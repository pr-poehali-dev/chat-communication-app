"""
Верифицирует код подтверждения, создаёт/находит пользователя и выдаёт сессионный токен.
"""
import json
import os
import secrets
from datetime import datetime
import psycopg2


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
}


def get_db():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path={schema}')
    return conn


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    email = (body.get('email') or '').strip().lower()
    code = (body.get('code') or '').strip()
    name = (body.get('name') or '').strip()

    if not email or not code:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите email и код'})
        }

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id FROM auth_codes
        WHERE email = %s AND code = %s AND used = FALSE AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
        """,
        (email, code)
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        return {
            'statusCode': 401,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Неверный или просроченный код'})
        }

    code_id = row[0]
    cur.execute("UPDATE auth_codes SET used = TRUE WHERE id = %s", (code_id,))

    cur.execute("SELECT id, name, username, status FROM users WHERE email = %s", (email,))
    user_row = cur.fetchone()

    if user_row:
        user_id, user_name, username, status = user_row
        is_new = False
    else:
        display_name = name if name else email.split('@')[0].capitalize()
        cur.execute(
            "INSERT INTO users (email, name) VALUES (%s, %s) RETURNING id, name, username, status",
            (email, display_name)
        )
        user_id, user_name, username, status = cur.fetchone()
        is_new = True

    token = secrets.token_hex(48)
    cur.execute(
        "INSERT INTO sessions (user_id, token) VALUES (%s, %s)",
        (user_id, token)
    )
    conn.commit()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'success': True,
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'name': user_name,
                'username': username,
                'status': status,
            },
            'is_new': is_new
        })
    }