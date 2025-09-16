import { formatTime } from '@/lib/utils/time';

describe('Time utilities', () => {
  describe('formatTime', () => {
    it('formats seconds to mm:ss format', () => {
      expect(formatTime(61)).toBe('1:01');
      expect(formatTime(130)).toBe('2:10');
      expect(formatTime(45)).toBe('0:45');
      expect(formatTime(120)).toBe('2:00');
    });

    it('handles zero seconds', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('handles large durations', () => {
      expect(formatTime(3661)).toBe('61:01'); // 1 hour 1 minute 1 second
      expect(formatTime(7200)).toBe('120:00'); // 2 hours
      expect(formatTime(3600)).toBe('60:00'); // 1 hour
    });

    it('handles decimal seconds by rounding down', () => {
      expect(formatTime(61.9)).toBe('1:01'); // 61.9 seconds rounds to 61
      expect(formatTime(130.7)).toBe('2:10'); // 130.7 seconds rounds to 130
    });

    it('pads seconds with leading zero', () => {
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(125)).toBe('2:05');
    });

    it('handles single digit minutes', () => {
      expect(formatTime(300)).toBe('5:00');
      expect(formatTime(305)).toBe('5:05');
      expect(formatTime(359)).toBe('5:59');
    });

    it('handles double digit minutes', () => {
      expect(formatTime(600)).toBe('10:00');
      expect(formatTime(605)).toBe('10:05');
      expect(formatTime(659)).toBe('10:59');
    });
  });
});
