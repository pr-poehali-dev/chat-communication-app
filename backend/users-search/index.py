"""
Поиск пользователей по имени или email.
Требует авторизации через токен сессии.
"""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
            'body': json.dumps({'error': 'Не авторизован'})
        }

    params = event.get('queryStringParameters') or {}
    query = (params.get('q') or '').strip()

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM sessions WHERE token = %s AND expires_at > NOW()", (token,))
    session = cur.fetchone()
    if not session:
        conn.close()
        return {
            'statusCode': 401,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Сессия истекла'})
        }

    current_user_id = session[0]

    if not query or len(query) < 2:
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'users': []})
        }

    search = f'%{query}%'
    cur.execute(
        """SELECT id, name, email, username, status
           FROM users
           WHERE id != %s AND (LOWER(name) LIKE LOWER(%s) OR LOWER(email) LIKE LOWER(%s))
           ORDER BY name
           LIMIT 20""",
        (current_user_id, search, search)
    )
    rows = cur.fetchall()
    conn.close()

    users = []
    for row in rows:
        uid, name, email, username, status = row
        display_name = name or email or username or 'Пользователь'
        initials = ''.join(w[0].upper() for w in display_name.split()[:2]) if display_name else '?'
        users.append({
            'id': str(uid),
            'name': display_name,
            'avatar': initials,
            'email': email or '',
            'status': status or '',
            'online': False,
        })

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'users': users})
    }
