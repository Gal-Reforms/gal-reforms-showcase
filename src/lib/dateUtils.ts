import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Spanish date and time formatting utilities
export const formatDate = (date: Date | string, pattern: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, pattern, { locale: es });
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatDateLong = (date: Date | string): string => {
  return formatDate(date, 'dd \'de\' MMMM \'de\' yyyy');
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yy');
};

export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

// Spanish number formatting utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-ES').format(number);
};

export const formatArea = (area: number): string => {
  return `${formatNumber(area)} m²`;
};

export const formatDuration = (months: number): string => {
  if (months === 1) return '1 mes';
  if (months < 12) return `${months} meses`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 1 && remainingMonths === 0) return '1 año';
  if (years > 1 && remainingMonths === 0) return `${years} años`;
  if (years === 1) return `1 año y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
  return `${years} años y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
};