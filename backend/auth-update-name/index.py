"""
Обновляет имя пользователя по токену сессии (используется при первой регистрации).
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
        return {'statusCode': 401, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Необходима авторизация'})}

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    if not name:
        return {'statusCode': 400, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Укажите имя'})}

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE users SET name = %s, updated_at = NOW()
        WHERE id = (SELECT user_id FROM sessions WHERE token = %s AND expires_at > NOW())
        RETURNING id, email, name, username, status
        """,
        (name, token)
    )
    row = cur.fetchone()
    conn.commit()
    conn.close()

    if not row:
        return {'statusCode': 401, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Сессия недействительна'})}

    user_id, email, user_name, username, status = row
    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True, 'user': {'id': user_id, 'email': email, 'name': user_name, 'username': username, 'status': status}})
    }
