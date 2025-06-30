import { formatDuration, parseMsToSeconds } from '@/lib/utils/duration';

describe('Duration utilities', () => {
  describe('formatDuration', () => {
    it('formats milliseconds to M:SS format', () => {
      expect(formatDuration(84000)).toBe('1:24');
      expect(formatDuration(45000)).toBe('0:45');
      expect(formatDuration(60000)).toBe('1:00');
      expect(formatDuration(30000)).toBe('0:30');
    });

    it('handles zero milliseconds', () => {
      expect(formatDuration(0)).toBe('0:00');
    });

    it('handles large durations', () => {
      expect(formatDuration(3661000)).toBe('61:01'); // 1 hour 1 minute 1 second
      expect(formatDuration(7200000)).toBe('120:00'); // 2 hours
    });

    it('handles decimal milliseconds by rounding down', () => {
      expect(formatDuration(84500)).toBe('1:24'); // 84.5 seconds rounds to 84
      expect(formatDuration(44999)).toBe('0:44'); // 44.999 seconds rounds to 44
    });

    it('pads seconds with leading zero', () => {
      expect(formatDuration(5000)).toBe('0:05');
      expect(formatDuration(65000)).toBe('1:05');
    });
  });

  describe('parseMsToSeconds', () => {
    it('converts milliseconds to seconds', () => {
      expect(parseMsToSeconds(1500)).toBe(1.5);
      expect(parseMsToSeconds(3000)).toBe(3);
      expect(parseMsToSeconds(1000)).toBe(1);
      expect(parseMsToSeconds(500)).toBe(0.5);
    });

    it('handles zero milliseconds', () => {
      expect(parseMsToSeconds(0)).toBe(0);
    });

    it('handles large values', () => {
      expect(parseMsToSeconds(3600000)).toBe(3600); // 1 hour
      expect(parseMsToSeconds(7200000)).toBe(7200); // 2 hours
    });

    it('preserves decimal precision', () => {
      expect(parseMsToSeconds(1234)).toBe(1.234);
      expect(parseMsToSeconds(123)).toBe(0.123);
    });
  });
});
