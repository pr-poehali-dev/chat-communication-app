import { useState } from 'react';
import { chats, type Chat, type Message } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ChatSection() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(() => {
    const init: { [key: string]: Message[] } = {};
    chats.forEach(c => { init[c.id] = c.messages; });
    return init;
  });

  const handleSend = () => {
    if (!inputValue.trim() || !selectedChat) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: inputValue,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      own: true,
      read: false,
      encrypted: true,
    };
    setMessages(prev => ({ ...prev, [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg] }));
    setInputValue('');
  };

  if (selectedChat) {
    const chatMessages = messages[selectedChat.id] || [];
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedChat(null)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors mr-1"
          >
            <Icon name="ChevronLeft" size={20} className="text-muted-foreground" />
          </button>
          <Avatar initials={selectedChat.avatar} online={selectedChat.online} size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{selectedChat.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {selectedChat.online ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />онлайн</>
              ) : 'был(а) недавно'}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Icon name="Lock" size={10} className="text-green-400" />
              <span className="text-green-400 text-[10px] font-medium">E2E</span>
            </div>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <Icon name="Phone" size={16} className="text-muted-foreground" />
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex ${msg.own ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className={`max-w-[75%] px-4 py-2.5 ${msg.own ? 'message-bubble-own text-white' : 'message-bubble-other text-foreground'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.own ? 'justify-end' : 'justify-start'}`}>
                  {msg.encrypted && <Icon name="Lock" size={9} className={msg.own ? 'text-white/50' : 'text-muted-foreground/50'} />}
                  <span className={`text-[10px] ${msg.own ? 'text-white/50' : 'text-muted-foreground/70'}`}>{msg.time}</span>
                  {msg.own && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className={msg.read ? 'text-cyan-300/80' : 'text-white/40'} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass border-t border-white/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
              <Icon name="Paperclip" size={16} className="text-muted-foreground" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Написать сообщение..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 glow-effect"
            >
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">Сообщения</h1>
          <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <Icon name="Plus" size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск в чатах..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all group animate-fade-in"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <Avatar initials={chat.avatar} online={chat.online} size="md" />
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm text-foreground truncate">{chat.name}</span>
                <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
