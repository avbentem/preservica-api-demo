import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

/**
 * Format the given Unix timestamp to a date and time in the (guessed) local timezone.
 *
 * @param ts Unix timestamp in milliseconds
 */
export function formatTimestamp(ts: number) {
  return dayjs(ts).format('YYYY-MM-DD HH:mm');
}
