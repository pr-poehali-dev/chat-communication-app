import { useState } from 'react';
import { contacts, type Contact } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ContactsSection() {
  const [selected, setSelected] = useState<Contact | null>(null);

  if (selected) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <Icon name="ChevronLeft" size={20} className="text-muted-foreground" />
          </button>
          <h2 className="font-semibold">Контакт</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center pt-10 pb-6 px-4">
            <div className="relative mb-4">
              <Avatar initials={selected.avatar} online={selected.online} size="xl" />
              {selected.online && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[hsl(var(--background))] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mb-1">{selected.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{selected.status}</p>
            <div className="flex gap-4">
              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center glow-effect group-hover:scale-110 transition-transform">
                  <Icon name="MessageCircle" size={20} className="text-white" />
                </div>
                <span className="text-[11px] text-muted-foreground">Написать</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Icon name="Phone" size={20} className="text-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">Позвонить</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Icon name="Video" size={20} className="text-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">Видео</span>
              </button>
            </div>
          </div>

          <div className="px-4 space-y-2">
            {selected.phone && (
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Phone" size={14} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Телефон</div>
                  <div className="text-sm font-medium">{selected.phone}</div>
                </div>
              </div>
            )}
            {selected.email && (
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon name="Mail" size={14} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">{selected.email}</div>
                </div>
              </div>
            )}
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="Lock" size={14} className="text-green-400" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Шифрование</div>
                <div className="text-sm font-medium text-green-400">Активно (E2E)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">Контакты</h1>
          <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <Icon name="UserPlus" size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск контактов..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 mb-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Онлайн — {contacts.filter(c => c.online).length}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {contacts.map((contact, i) => (
          <button
            key={contact.id}
            onClick={() => setSelected(contact)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Avatar initials={contact.avatar} online={contact.online} size="md" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{contact.name}</div>
              <div className="text-xs text-muted-foreground">{contact.status}</div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
          </button>
        ))}
      </div>
    </div>
  );
}
