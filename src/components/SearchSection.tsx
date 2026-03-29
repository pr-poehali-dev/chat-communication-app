import { useState } from 'react';
import { chats, contacts } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function SearchSection() {
  const [query, setQuery] = useState('');

  const filteredChats = query.length > 0
    ? chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.lastMessage.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredContacts = query.length > 0
    ? contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold gradient-text mb-4">Поиск</h1>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Люди, чаты, сообщения..."
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full pb-20 gap-4 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-float">
              <Icon name="Search" size={28} className="text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Найди что угодно</p>
              <p className="text-xs text-muted-foreground">Ищи контакты, чаты и сообщения</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['Алексей', 'Команда', 'Мария'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && filteredChats.length === 0 && filteredContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60%] gap-3 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Icon name="SearchX" size={24} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">Ничего не найдено по «{query}»</p>
          </div>
        )}

        {filteredChats.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-3 mb-2">Чаты</p>
            {filteredChats.map((chat, i) => (
              <div
                key={chat.id}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Avatar initials={chat.avatar} online={chat.online} size="md" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{chat.name}</div>
                  <div className="text-xs text-muted-foreground">{chat.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredContacts.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider px-3 mb-2">Контакты</p>
            {filteredContacts.map((contact, i) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <Avatar initials={contact.avatar} online={contact.online} size="md" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{contact.name}</div>
                  <div className="text-xs text-muted-foreground">{contact.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
