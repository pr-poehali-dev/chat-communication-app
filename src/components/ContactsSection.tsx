import { useState, useEffect, useRef } from 'react';
import { type Contact } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import { searchUsers } from '@/lib/api';

export default function ContactsSection() {
  const [selected, setSelected] = useState<Contact | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await searchUsers(query.trim());
      setResults(res.users || []);
      setLoading(false);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

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
            </div>
            <h2 className="text-xl font-bold mb-1">{selected.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{selected.status || 'Пользователь'}</p>
            <div className="flex gap-4">
              <button className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center glow-effect group-hover:scale-110 transition-transform">
                  <Icon name="MessageCircle" size={20} className="text-white" />
                </div>
                <span className="text-[11px] text-muted-foreground">Написать</span>
              </button>
            </div>
          </div>

          <div className="px-4 space-y-2">
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
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Найти пользователя..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-9 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <Icon name="UserX" size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Пользователи не найдены</p>
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <Icon name="Users" size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Введите имя или email для поиска</p>
          </div>
        )}

        {!loading && results.map((contact, i) => (
          <button
            key={contact.id}
            onClick={() => setSelected(contact)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Avatar initials={contact.avatar} online={contact.online} size="md" />
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm">{contact.name}</div>
              <div className="text-xs text-muted-foreground">{contact.email}</div>
            </div>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground/50" />
          </button>
        ))}
      </div>
    </div>
  );
}
