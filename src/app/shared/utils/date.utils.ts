/**
 * Utilitários para formatação de data e hora
 * Formato de data: dd/mm/yyyy
 * Formato de hora: hh:mm
 */

export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return '';

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return '';

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';

  return `${formatDate(date)} ${formatTime(date)}`;
}

export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Formato esperado: dd/mm/yyyy
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) return null;

  return date;
}

export function parseTime(timeString: string, baseDate?: Date): Date | null {
  if (!timeString) return null;

  // Formato esperado: hh:mm
  const parts = timeString.split(':');
  if (parts.length !== 2) return null;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  const date = baseDate ? new Date(baseDate) : new Date();
  date.setHours(hours, minutes, 0, 0);

  if (isNaN(date.getTime())) return null;

  return date;
}
