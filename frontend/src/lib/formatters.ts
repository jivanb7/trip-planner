import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns'

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d')
}

export function formatDateRange(start: string, end: string): string {
  const startDate = parseISO(start)
  const endDate = parseISO(end)
  const startFormatted = format(startDate, 'MMM d')
  const endFormatted = format(endDate, 'MMM d, yyyy')
  return `${startFormatted} - ${endFormatted}`
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return ''
  return format(parseISO(timeStr), 'h:mm a')
}

export function formatTimeShort(timeStr: string | null): string {
  if (!timeStr) return ''
  // Handle HH:mm format
  if (timeStr.length <= 5) {
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }
  return format(parseISO(timeStr), 'h:mm a')
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function getDayCount(start: string, end: string): number {
  return differenceInDays(parseISO(end), parseISO(start)) + 1
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(Math.round((value / total) * 100), 100)
}
