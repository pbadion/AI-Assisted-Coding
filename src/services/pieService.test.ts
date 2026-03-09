/**
 * Unit tests for pieService – getPies, getMonthlyPies, searchPies; success and error cases
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pieService } from './pieService';

const mockPies = [
  {
    id: '1',
    name: 'Apple Pie',
    price: 12.99,
    description: 'Classic',
    category: 'fruit',
    image: '/img.jpg',
  },
];

describe('pieService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getPies', () => {
    it('fetches pies without category', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPies),
      } as Response);
      const result = await pieService.getPies();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/pies'));
      expect(fetch).toHaveBeenCalledWith(expect.not.stringContaining('category='));
      expect(result).toEqual(mockPies);
    });

    it('fetches pies with category', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPies),
      } as Response);
      await pieService.getPies('fruit');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('category=fruit'));
    });

    it('throws on HTTP error status', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);
      await expect(pieService.getPies()).rejects.toThrow('HTTP error! status: 404');
    });

    it('throws on network failure', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network failed'));
      await expect(pieService.getPies()).rejects.toThrow('Failed to fetch pies');
    });
  });

  describe('getMonthlyPies', () => {
    it('fetches monthly pies', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPies),
      } as Response);
      const result = await pieService.getMonthlyPies();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/pies-of-the-month'));
      expect(result).toEqual(mockPies);
    });

    it('throws on error', async () => {
      vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
      await expect(pieService.getMonthlyPies()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('searchPies', () => {
    it('fetches with search and category params', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPies),
      } as Response);
      await pieService.searchPies('apple', 'fruit');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('search=apple'));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('category=fruit'));
    });

    it('throws on failure', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Failed'));
      await expect(pieService.searchPies('x')).rejects.toThrow('Failed to search pies');
    });
  });
});
