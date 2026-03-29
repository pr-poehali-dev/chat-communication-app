import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  status: string;
}

interface ProfileSectionProps {
  user: User;
  onLogout: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function ProfileSection({ user, onLogout }: ProfileSectionProps) {
  const initials = getInitials(user.name || user.email);

  const fields = [
    { icon: 'User', label: 'Имя', value: user.name || '—' },
    { icon: 'Mail', label: 'Email', value: user.email },
    { icon: 'AtSign', label: 'Username', value: user.username ? `@${user.username}` : '—' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold gradient-text mb-4">Профиль</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        <div className="glass rounded-3xl p-5 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <Avatar initials={initials} size="xl" gradient={0} />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-bg flex items-center justify-center border-2 border-[hsl(var(--background))] hover:scale-110 transition-transform">
              <Icon name="Camera" size={12} className="text-white" />
            </button>
          </div>
          <h2 className="text-lg font-bold mb-0.5">{user.name || 'Пользователь'}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {user.username ? `@${user.username}` : user.email} · Онлайн
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <Icon name="Lock" size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">Сквозное шифрование активно</span>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Статус</p>
          </div>
          <div className="px-4 py-3">
            <input
              type="text"
              defaultValue={user.status || 'Привет, я в Чат Да!'}
              className="w-full bg-transparent text-sm text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {fields.map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 cursor-pointer transition-colors ${i < fields.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={14} className="text-primary" fallback="User" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</div>
                <div className="text-sm font-medium">{item.value}</div>
              </div>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex-1">
              <div className="text-sm font-semibold mb-0.5">Моя безопасность</div>
              <div className="text-xs text-muted-foreground">Управление ключами шифрования</div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Icon name="ShieldCheck" size={12} className="text-green-400" />
              <span className="text-xs text-green-400 font-medium">Защищён</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full glass rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:bg-red-500/5 hover:border-red-500/20 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <Icon name="LogOut" size={14} className="text-red-400" />
          </div>
          <span className="text-sm font-medium text-red-400">Выйти из аккаунта</span>
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
}