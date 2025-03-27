/**
 * Formats a duration string by removing leading zeros and unnecessary time components
 * @param duration - The duration string to format (e.g., "00:00:54" or "00:01:19")
 * @returns A formatted duration string without leading zeros, with "0:" prefix for durations less than a minute
 * @example
 * formatDuration("00:00:54") // returns "0:54"
 * formatDuration("00:01:19") // returns "1:19"
 * formatDuration("00:02:30") // returns "2:30"
 */
export function formatDuration(duration: string): string {
  const formatted = duration.replace(/^0+:/, '').replace(/^0+/, '');
  // If the duration doesn't contain a colon, it's less than a minute
  if (!formatted.includes(':')) {
    return `0:${formatted}`;
  }
  return formatted;
}

/**
 * Converts a duration string into total seconds
 * @param duration - The duration string to parse (e.g., "1:54" or "2:30")
 * @returns The total number of seconds
 * @example
 * parseDuration("1:54") // returns 114
 * parseDuration("2:30") // returns 150
 * parseDuration("0:45") // returns 45
 */
export function parseDuration(duration: string): number {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
