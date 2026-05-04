/**
 * time-utils.ts
 * Shared time helpers used by event publish API routes.
 */

/**
 * Convert a 12-hour time string (e.g. "7:00 PM") to an ISO time string
 * (e.g. "19:00:00") suitable for appending to a date string before passing
 * to `new Date()` or `Timestamp.fromDate()`.
 *
 * Falls back to "19:00:00" (7 PM) if the input cannot be parsed.
 */
export function timeToISO(timeStr: string): string {
  try {
    const [time, meridiem] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (meridiem?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;
  } catch {
    return '19:00:00';
  }
}
