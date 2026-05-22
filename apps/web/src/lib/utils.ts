import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getInitials(name?: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function generateAvatarUrl(name?: string | null, size = 40): string {
  const displayName = name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=${size}&background=6366f1&color=fff&bold=true`;
}

export const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
  insightful: '💡',
  curious: '🤔',
};

export const REACTION_LABELS: Record<string, string> = {
  like: 'Like',
  love: 'Love',
  celebrate: 'Celebrate',
  insightful: 'Insightful',
  curious: 'Curious',
};
