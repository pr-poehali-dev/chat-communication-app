const URLS = {
  sendCode: 'https://functions.poehali.dev/3b94d294-c3f0-4784-b301-d3d6224e8c54',
  verify: 'https://functions.poehali.dev/ddc2dc9f-2221-4173-9c66-ee45c6b0f4e0',
  me: 'https://functions.poehali.dev/3fa94dfb-7d95-42fe-91e9-8c805ad8f632',
  updateName: 'https://functions.poehali.dev/b67c162e-80ae-4b9a-ba44-d4b6c5e77f7e',
};

export function getToken(): string | null {
  return localStorage.getItem('sc_token');
}

export function setToken(token: string) {
  localStorage.setItem('sc_token', token);
}

export function clearToken() {
  localStorage.removeItem('sc_token');
  localStorage.removeItem('sc_user');
}

export async function sendCode(email: string): Promise<{ success: boolean; dev_code?: string; error?: string }> {
  const res = await fetch(URLS.sendCode, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyCode(email: string, code: string, name?: string): Promise<{
  success?: boolean;
  token?: string;
  user?: { id: number; email: string; name: string; username: string; status: string };
  is_new?: boolean;
  error?: string;
}> {
  const res = await fetch(URLS.verify, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, name }),
  });
  return res.json();
}

export async function fetchMe(): Promise<{ id?: number; email?: string; name?: string; username?: string; status?: string; error?: string }> {
  const token = getToken();
  if (!token) return { error: 'no token' };
  const res = await fetch(URLS.me, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}