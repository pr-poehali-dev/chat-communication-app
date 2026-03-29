import { useState } from 'react';
import { notifications as initNotifications, type Notification } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const typeIcon: Record<Notification['type'], string> = {
  message: 'MessageCircle',
  call: 'PhoneCall',
  system: 'Shield',
};

const typeColor: Record<Notification['type'], string> = {
  message: 'text-primary',
  call: 'text-green-400',
  system: 'text-cyan-400',
};

export default function NotificationsSection() {
  const [items, setItems] = useState(initNotifications);

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold gradient-text">Уведомления</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full gradient-bg text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAll} className="text-xs text-primary hover:text-primary/80 transition-colors">
              Прочитать все
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {items.map((notif, i) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 px-3 py-3 rounded-2xl transition-all animate-fade-in cursor-pointer
              ${!notif.read ? 'bg-primary/5 border border-primary/10 hover:bg-primary/8' : 'hover:bg-white/5'}`}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => setItems(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
          >
            <div className="relative mt-0.5">
              {notif.avatar ? (
                <Avatar initials={notif.avatar} size="md" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon name={typeIcon[notif.type]} size={18} className={typeColor[notif.type]} fallback="Bell" />
                </div>
              )}
              {notif.avatar && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[hsl(var(--card))] border border-white/10 flex items-center justify-center">
                  <Icon name={typeIcon[notif.type]} size={10} className={typeColor[notif.type]} fallback="Bell" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm font-semibold ${!notif.read ? 'text-foreground' : 'text-foreground/80'}`}>
                  {notif.title}
                </span>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{notif.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{notif.text}</p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full gradient-bg mt-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
