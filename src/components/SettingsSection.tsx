import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${value ? 'gradient-bg' : 'bg-white/10'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

interface SettingItem {
  icon: string;
  label: string;
  description?: string;
  toggle?: boolean;
  value?: boolean;
  color?: string;
  arrow?: boolean;
}

interface SettingsGroup {
  title: string;
  items: SettingItem[];
}

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    e2e: true,
    notifications: true,
    sounds: true,
    readReceipts: true,
    onlineStatus: true,
    twoFactor: false,
    darkMode: true,
    compactMode: false,
  });

  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const groups: SettingsGroup[] = [
    {
      title: 'Безопасность',
      items: [
        { icon: 'Lock', label: 'Сквозное шифрование', description: 'E2E для всех сообщений', toggle: true, value: settings.e2e, color: 'text-green-400' },
        { icon: 'ShieldCheck', label: 'Двухфакторная аутентификация', description: 'Дополнительная защита', toggle: true, value: settings.twoFactor, color: 'text-cyan-400' },
        { icon: 'Key', label: 'Управление ключами', arrow: true, color: 'text-amber-400' },
      ]
    },
    {
      title: 'Уведомления',
      items: [
        { icon: 'Bell', label: 'Push-уведомления', toggle: true, value: settings.notifications, color: 'text-primary' },
        { icon: 'Volume2', label: 'Звуки', toggle: true, value: settings.sounds, color: 'text-purple-400' },
      ]
    },
    {
      title: 'Конфиденциальность',
      items: [
        { icon: 'CheckCheck', label: 'Отметки о прочтении', toggle: true, value: settings.readReceipts, color: 'text-blue-400' },
        { icon: 'Eye', label: 'Показывать статус онлайн', toggle: true, value: settings.onlineStatus, color: 'text-indigo-400' },
      ]
    },
    {
      title: 'Внешний вид',
      items: [
        { icon: 'Moon', label: 'Тёмная тема', toggle: true, value: settings.darkMode, color: 'text-violet-400' },
        { icon: 'LayoutGrid', label: 'Компактный режим', toggle: true, value: settings.compactMode, color: 'text-pink-400' },
      ]
    }
  ];

  const toggleKeys: Record<string, keyof typeof settings> = {
    'Сквозное шифрование': 'e2e',
    'Двухфакторная аутентификация': 'twoFactor',
    'Push-уведомления': 'notifications',
    'Звуки': 'sounds',
    'Отметки о прочтении': 'readReceipts',
    'Показывать статус онлайн': 'onlineStatus',
    'Тёмная тема': 'darkMode',
    'Компактный режим': 'compactMode',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold gradient-text mb-4">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {groups.map((group, gi) => (
          <div key={group.title} className="animate-fade-in" style={{ animationDelay: `${gi * 0.08}s` }}>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 px-1">{group.title}</p>
            <div className="glass rounded-2xl overflow-hidden">
              {group.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer ${i < group.items.length - 1 ? 'border-b border-white/5' : ''}`}
                  onClick={() => item.toggle && toggleKeys[item.label] && toggle(toggleKeys[item.label])}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={15} className={item.color || 'text-muted-foreground'} fallback="Settings" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                  </div>
                  {item.toggle && <Toggle value={item.value!} onChange={() => toggleKeys[item.label] && toggle(toggleKeys[item.label])} />}
                  {item.arrow && <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">Чат Да! v1.0.0</p>
          <p className="text-[10px] text-muted-foreground/50 mt-0.5">Все сообщения защищены сквозным шифрованием</p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}