import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ChatSection from '@/components/ChatSection';
import ContactsSection from '@/components/ContactsSection';
import SearchSection from '@/components/SearchSection';
import NotificationsSection from '@/components/NotificationsSection';
import ProfileSection from '@/components/ProfileSection';
import SettingsSection from '@/components/SettingsSection';

type Tab = 'chats' | 'contacts' | 'search' | 'notifications' | 'profile' | 'settings';

interface NavItem {
  id: Tab;
  icon: string;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты', badge: 7 },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'notifications', icon: 'Bell', label: 'Уведомления', badge: 3 },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
];

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  status: string;
}

interface IndexProps {
  user: User;
  onLogout: () => void;
}

export default function Index({ user, onLogout }: IndexProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [animKey, setAnimKey] = useState(0);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setAnimKey(k => k + 1);
  };

  const sectionComponents: Record<Tab, React.ReactNode> = {
    chats: <ChatSection />,
    contacts: <ContactsSection />,
    search: <SearchSection />,
    notifications: <NotificationsSection />,
    profile: <ProfileSection user={user} onLogout={onLogout} />,
    settings: <SettingsSection />,
  };

  return (
    <div className="h-screen w-screen bg-[hsl(var(--background))] flex overflow-hidden font-golos">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/6 blur-[80px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
      </div>

      <aside className="hidden md:flex w-[72px] flex-col items-center py-5 gap-2 border-r border-white/5 relative z-10 bg-[hsl(var(--sidebar-background))]">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-3 glow-effect animate-pulse-glow">
          <Icon name="Zap" size={18} className="text-white" />
        </div>

        <div className="flex-1 flex flex-col gap-1 w-full px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group
                ${activeTab === item.id ? 'nav-item-active' : 'hover:bg-white/5'}`}
            >
              <div className="relative">
                <Icon
                  name={item.icon}
                  size={20}
                  className={activeTab === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}
                  fallback="Circle"
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full gradient-bg text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full gradient-bg" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1 w-full px-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all group
                ${activeTab === item.id ? 'nav-item-active' : 'hover:bg-white/5'}`}
            >
              <Icon
                name={item.icon}
                size={20}
                className={activeTab === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}
                fallback="Circle"
              />
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full gradient-bg" />
              )}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10 pb-16 md:pb-0 overflow-hidden">
        <div key={animKey} className="flex-1 overflow-hidden animate-fade-in h-full">
          {sectionComponents[activeTab]}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {[...navItems, ...bottomNavItems].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all
                ${activeTab === item.id ? 'nav-item-active' : 'hover:bg-white/5'}`}
            >
              <div className="relative">
                <Icon
                  name={item.icon}
                  size={20}
                  className={activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}
                  fallback="Circle"
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full gradient-bg text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}