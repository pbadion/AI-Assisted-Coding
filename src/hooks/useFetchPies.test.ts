/**
 * Unit tests for useFetchPies – loading, error, success, refetch, edge/error cases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchPies } from './useFetchPies';
import type { Pie } from '../types/pie';

const mockPies: Pie[] = [
  {
    id: '1',
    name: 'Apple Pie',
    price: 12.99,
    description: 'Classic',
    category: 'fruit',
    image: '/img/apple.jpg',
  },
];

describe('useFetchPies', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('starts with loading true and empty pies', () => {
    const fetcher = vi.fn().mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    expect(result.current.loading).toBe(true);
    expect(result.current.pies).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('sets pies and clears loading on successful fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockPies);
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.pies).toEqual(mockPies);
    expect(result.current.error).toBeNull();
  });

  it('sets error when fetcher throws', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network failed'));
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Network failed');
    expect(result.current.pies).toEqual([]);
  });

  it('handles non-Error rejection and sets generic message', async () => {
    const fetcher = vi.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Failed to fetch pies');
    expect(result.current.pies).toEqual([]);
  });

  it('handles empty array response', async () => {
    const fetcher = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.pies).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('refetch calls fetcher again and updates state', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(mockPies)
      .mockResolvedValueOnce([...mockPies, { ...mockPies[0], id: '2', name: 'Berry' }]);
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.pies).toHaveLength(1);
    result.current.refetch();
    await waitFor(() => {
      expect(result.current.pies).toHaveLength(2);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('refetch after error clears error and retries', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('First fail'))
      .mockResolvedValueOnce(mockPies);
    const { result } = renderHook(() => useFetchPies(fetcher, []));
    await waitFor(() => {
      expect(result.current.error).toBe('First fail');
    });
    result.current.refetch();
    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.pies).toEqual(mockPies);
    });
  });

  it('re-runs fetch when deps change', async () => {
    const fetcher = vi.fn().mockResolvedValue(mockPies);
    const { result, rerender } = renderHook(
      ({ category }: { category: string }) => useFetchPies(() => fetcher(category), [category]),
      { initialProps: { category: 'fruit' } }
    );
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(fetcher).toHaveBeenCalledWith('fruit');
    rerender({ category: 'cheesecake' });
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledWith('cheesecake');
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
