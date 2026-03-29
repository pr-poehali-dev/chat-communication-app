"""
Возвращает данные текущего пользователя по токену сессии.
Токен передаётся в заголовке Authorization: Bearer <token>.
"""
import json
import os
import psycopg2


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id, Authorization',
    'Access-Control-Max-Age': '86400',
}


def get_db():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'], options=f'-c search_path={schema}')
    return conn


def get_token(event: dict) -> str:
    auth = event.get('headers', {}).get('X-Authorization', '')
    if auth.startswith('Bearer '):
        return auth[7:]
    return ''


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    token = get_token(event)
    if not token:
        return {
            'statusCode': 401,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Необходима авторизация'})
        }

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT u.id, u.email, u.name, u.username, u.status
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = %s AND s.expires_at > NOW()
        """,
        (token,)
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return {
            'statusCode': 401,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Сессия истекла или недействительна'})
        }

    user_id, email, name, username, status = row
    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'id': user_id,
            'email': email,
            'name': name,
            'username': username,
            'status': status,
        })
    }