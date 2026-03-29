"""
Отправляет код подтверждения на email пользователя для входа/регистрации.
Генерирует 6-значный код, сохраняет в БД на 10 минут, отправляет на email.
"""
import json
import os
import random
import string
from datetime import datetime, timedelta
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


def send_email_code(email: str, code: str):
    """Отправка кода через Yandex SMTP"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_login = os.environ.get('SMTP_LOGIN', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    if not smtp_login or not smtp_password:
        return False

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Ваш код входа: {code}'
    msg['From'] = smtp_login
    msg['To'] = email

    html = f"""
    <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
      <h2 style="color: #6C63FF; margin-bottom: 8px;">SecureChat</h2>
      <p style="color: #888; font-size: 14px; margin-bottom: 32px;">Защищённый мессенджер</p>
      <p style="color: #333; font-size: 16px;">Ваш код для входа:</p>
      <div style="background: linear-gradient(135deg,#6C63FF,#A855F7); border-radius: 16px; padding: 24px; text-align: center; margin: 20px 0;">
        <span style="color: white; font-size: 36px; font-weight: 900; letter-spacing: 8px;">{code}</span>
      </div>
      <p style="color: #888; font-size: 13px;">Код действителен 10 минут. Никому его не сообщайте.</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_login, smtp_password)
        server.sendmail(smtp_login, email, msg.as_string())
    return True


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    email = (body.get('email') or '').strip().lower()

    if not email or '@' not in email:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Введите корректный email'})
        }

    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO auth_codes (email, code, expires_at) VALUES (%s, %s, %s)",
        (email, code, expires_at)
    )
    conn.commit()
    conn.close()

    email_sent = False
    try:
        email_sent = send_email_code(email, code)
    except Exception:
        pass

    response_body = {'success': True, 'email': email}
    if not email_sent:
        response_body['dev_code'] = code

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(response_body)
    }