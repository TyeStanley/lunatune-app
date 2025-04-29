/**
 * Formats a time duration in seconds to a mm:ss format
 * @param seconds - The duration in seconds to format
 * @returns A string in the format "mm:ss"
 * @example
 * formatTime(61) // returns "1:01"
 * formatTime(130) // returns "2:10"
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
