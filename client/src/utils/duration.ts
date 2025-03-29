/**
 * Formats milliseconds into a duration string (M:SS format)
 * @param ms - The duration in milliseconds
 * @returns A formatted duration string (e.g., "1:23" or "0:45")
 * @example
 * formatDuration(84000) // returns "1:24"
 * formatDuration(45000) // returns "0:45"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

/**
 * Converts milliseconds to seconds
 * @param ms - The duration in milliseconds
 * @returns The total number of seconds
 * @example
 * parseDuration(1500) // returns 1.5
 * parseDuration(3000) // returns 3
 */
export function parseMsToSeconds(ms: number): number {
  return ms / 1000;
}
