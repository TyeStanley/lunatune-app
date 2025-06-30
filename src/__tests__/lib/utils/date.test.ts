import { getRelativeTime } from '@/lib/utils/date';

describe('Date utilities', () => {
  describe('getRelativeTime', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 30000); // 30 seconds ago
      const result = getRelativeTime(recentDate.toISOString());
      expect(result).toBe('just now');
    });

    it('formats minutes correctly', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 120000); // 2 minutes ago
      const result = getRelativeTime(past.toISOString());
      expect(result).toBe('2 minutes ago');
    });

    it('formats hours correctly', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 7200000); // 2 hours ago
      const result = getRelativeTime(past.toISOString());
      expect(result).toBe('2 hours ago');
    });

    it('formats days correctly', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 172800000); // 2 days ago
      const result = getRelativeTime(past.toISOString());
      expect(result).toBe('2 days ago');
    });

    it('handles singular forms correctly', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 60000); // 1 minute ago
      const result = getRelativeTime(past.toISOString());
      expect(result).toBe('1 minute ago');
    });
  });
});
