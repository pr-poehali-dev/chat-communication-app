export interface Message {
  id: string;
  text: string;
  time: string;
  own: boolean;
  read?: boolean;
  encrypted?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  phone?: string;
  email?: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'call' | 'system';
  title: string;
  text: string;
  time: string;
  read: boolean;
  avatar?: string;
}

export const chats: Chat[] = [
  {
    id: '1',
    name: 'Алексей Морозов',
    avatar: 'АМ',
    lastMessage: 'Окей, увидимся завтра 👋',
    time: '14:32',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', text: 'Привет! Как дела?', time: '14:20', own: false, encrypted: true },
      { id: 'm2', text: 'Всё отлично, спасибо! Готовлюсь к встрече завтра.', time: '14:22', own: true, read: true, encrypted: true },
      { id: 'm3', text: 'Отлично, тогда жди деталей вечером', time: '14:28', own: false, encrypted: true },
      { id: 'm4', text: 'Окей, увидимся завтра 👋', time: '14:32', own: false, encrypted: true },
    ]
  },
  {
    id: '2',
    name: 'Команда дизайн',
    avatar: 'КД',
    lastMessage: 'Макеты готовы, проверьте!',
    time: '13:15',
    unread: 5,
    online: false,
    messages: [
      { id: 'm1', text: 'Задача на сегодня — обновить главную страницу', time: '10:00', own: false, encrypted: true },
      { id: 'm2', text: 'Принято! Беру в работу', time: '10:05', own: true, read: true, encrypted: true },
      { id: 'm3', text: 'Макеты готовы, проверьте!', time: '13:15', own: false, encrypted: true },
    ]
  },
  {
    id: '3',
    name: 'Мария Сидорова',
    avatar: 'МС',
    lastMessage: 'Спасибо за помощь!',
    time: 'вчера',
    unread: 0,
    online: true,
    messages: [
      { id: 'm1', text: 'Можешь помочь с проектом?', time: 'вчера', own: false, encrypted: true },
      { id: 'm2', text: 'Конечно! Что именно нужно?', time: 'вчера', own: true, read: true, encrypted: true },
      { id: 'm3', text: 'Спасибо за помощь!', time: 'вчера', own: false, encrypted: true },
    ]
  },
  {
    id: '4',
    name: 'Дмитрий Козлов',
    avatar: 'ДК',
    lastMessage: 'Файл отправил на почту',
    time: 'вчера',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', text: 'Нужен отчёт за прошлую неделю', time: 'вчера', own: false, encrypted: true },
      { id: 'm2', text: 'Файл отправил на почту', time: 'вчера', own: true, read: true, encrypted: true },
    ]
  },
  {
    id: '5',
    name: 'Анна Волкова',
    avatar: 'АВ',
    lastMessage: '🎉 С днём рождения!',
    time: 'пн',
    unread: 1,
    online: false,
    messages: [
      { id: 'm1', text: '🎉 С днём рождения!', time: 'пн', own: false, encrypted: true },
    ]
  },
];

export const contacts: Contact[] = [];

export const notifications: Notification[] = [
  { id: '1', type: 'message', title: 'Алексей Морозов', text: 'Отправил вам новое сообщение', time: '5 мин назад', read: false, avatar: 'АМ' },
  { id: '2', type: 'call', title: 'Входящий звонок', text: 'Мария Сидорова звонила вам', time: '15 мин назад', read: false, avatar: 'МС' },
  { id: '3', type: 'message', title: 'Команда дизайн', text: '5 новых сообщений в группе', time: '1 час назад', read: false, avatar: 'КД' },
  { id: '4', type: 'system', title: 'Безопасность', text: 'Шифрование сообщений активно', time: '2 часа назад', read: true },
  { id: '5', type: 'message', title: 'Анна Волкова', text: 'Поздравила вас с днём рождения', time: 'вчера', read: true, avatar: 'АВ' },
  { id: '6', type: 'system', title: 'Обновление', text: 'Приложение обновлено до версии 2.0', time: '2 дня назад', read: true },
];