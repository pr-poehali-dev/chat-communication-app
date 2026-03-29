interface AvatarProps {
  initials: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: number;
}

const gradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-blue-600',
];

export default function Avatar({ initials, online, size = 'md', gradient }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const dotSizes = {
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-3.5 h-3.5 border-2',
  };

  const gradIdx = gradient !== undefined ? gradient % gradients.length : (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % gradients.length;

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradients[gradIdx]} flex items-center justify-center font-semibold text-white`}>
        {initials}
      </div>
      {online !== undefined && (
        <div className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full ${online ? 'bg-green-500' : 'bg-gray-500'} border-[hsl(var(--background))]`} />
      )}
    </div>
  );
}
