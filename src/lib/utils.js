import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn: Junta classes utilitárias do Tailwind, removendo duplicatas e mesclando corretamente.
 * Uso: cn('bg-red-500', condition && 'text-white')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 