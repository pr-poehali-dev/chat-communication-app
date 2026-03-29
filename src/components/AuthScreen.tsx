import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { sendCode, verifyCode, setToken } from '@/lib/api';

interface AuthScreenProps {
  onAuth: (user: { id: number; email: string; name: string; username: string; status: string }) => void;
}

type Step = 'email' | 'code' | 'name';

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  const [resendTimer, setResendTimer] = useState(0);
  const [pendingAuth, setPendingAuth] = useState<{ token: string; user: { id: number; email: string; name: string; username: string; status: string } } | null>(null);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    if (!email.includes('@')) { setError('Введите корректный email'); return; }
    setError('');
    setLoading(true);
    const res = await sendCode(email);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    if (res.dev_code) setDevCode(res.dev_code);
    setResendTimer(60);
    setStep('code');
    setTimeout(() => codeRefs.current[0]?.focus(), 100);
  };

  const handleCodeInput = (i: number, val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length > 1) {
      const arr = [...code];
      for (let j = 0; j < 6 && j < digits.length; j++) arr[i + j] = digits[j];
      setCode(arr.slice(0, 6));
      const next = Math.min(i + digits.length, 5);
      codeRefs.current[next]?.focus();
      return;
    }
    const arr = [...code];
    arr[i] = digits;
    setCode(arr);
    if (digits && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      const arr = [...code];
      arr[i - 1] = '';
      setCode(arr);
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('Введите 6-значный код'); return; }
    setError('');
    setLoading(true);
    const res = await verifyCode(email, fullCode);
    setLoading(false);
    if (res.error) { setError(res.error); setCode(['','','','','','']); codeRefs.current[0]?.focus(); return; }
    if (!res.token || !res.user) { setError('Ошибка сервера, попробуйте снова'); return; }
    if (res.is_new) {
      setPendingAuth({ token: res.token, user: res.user });
      setStep('name');
      return;
    }
    setToken(res.token);
    localStorage.setItem('sc_user', JSON.stringify(res.user));
    onAuth(res.user);
  };

  const handleNameSubmit = () => {
    if (!name.trim()) { setError('Введите ваше имя'); return; }
    if (!pendingAuth) return;
    const updatedUser = { ...pendingAuth.user, name: name.trim() };
    setToken(pendingAuth.token);
    localStorage.setItem('sc_user', JSON.stringify(updatedUser));
    onAuth(updatedUser);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 font-golos">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-scale-in">
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center glow-effect animate-pulse-glow">
              <Icon name="Zap" size={28} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black gradient-text">SecureChat</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Защищённый мессенджер</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          {step === 'email' && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-1">Войти или зарегистрироваться</h2>
              <p className="text-sm text-muted-foreground mb-5">Введите email — пришлём код для входа</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <Icon name="AlertCircle" size={12} />
                    {error}
                  </p>
                )}
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full gradient-bg text-white font-semibold py-3 rounded-2xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 glow-effect"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Отправляем...
                    </span>
                  ) : 'Получить код'}
                </button>
              </div>
            </div>
          )}

          {step === 'code' && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setStep('email'); setCode(['','','','','','']); setError(''); setDevCode(''); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <Icon name="ChevronLeft" size={14} />
                Изменить email
              </button>
              <h2 className="text-lg font-bold mb-1">Введите код</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Отправили код на <span className="text-foreground font-medium">{email}</span>
              </p>

              {devCode && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <Icon name="Info" size={14} className="text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">Код для теста: <span className="font-bold text-amber-200">{devCode}</span></p>
                </div>
              )}

              <div className="flex gap-2 justify-center mb-4">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={d}
                    onChange={e => handleCodeInput(i, e.target.value)}
                    onKeyDown={e => handleCodeKey(i, e)}
                    className={`w-11 h-12 rounded-xl bg-white/5 border text-center text-lg font-bold text-foreground focus:outline-none transition-all
                      ${d ? 'border-primary/60 bg-primary/5' : 'border-white/10 focus:border-primary/40'}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-400 flex items-center gap-1 justify-center mb-3">
                  <Icon name="AlertCircle" size={12} />
                  {error}
                </p>
              )}

              <button
                onClick={() => handleVerify()}
                disabled={loading || code.join('').length < 6}
                className="w-full gradient-bg text-white font-semibold py-3 rounded-2xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 glow-effect mb-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Проверяем...
                  </span>
                ) : 'Войти'}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-xs text-muted-foreground">Отправить снова через {resendTimer}с</p>
                ) : (
                  <button onClick={handleSendCode} className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Отправить код повторно
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'name' && (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Icon name="UserCheck" size={24} className="text-green-400" />
                </div>
              </div>
              <h2 className="text-lg font-bold mb-1 text-center">Добро пожаловать!</h2>
              <p className="text-sm text-muted-foreground mb-5 text-center">Как вас зовут?</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Ваше имя"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                {error && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <Icon name="AlertCircle" size={12} />
                    {error}
                  </p>
                )}
                <button
                  onClick={handleNameSubmit}
                  className="w-full gradient-bg text-white font-semibold py-3 rounded-2xl transition-all hover:opacity-90 active:scale-95 glow-effect"
                >
                  Начать общение
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-5">
          <Icon name="Lock" size={12} className="text-muted-foreground/50" />
          <p className="text-[11px] text-muted-foreground/50">Все сообщения защищены сквозным шифрованием</p>
        </div>
      </div>
    </div>
  );
}