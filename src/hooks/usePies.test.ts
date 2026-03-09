/**
 * Unit tests for usePies, useMonthlyPies, useSearchPies – delegation and edge cases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePies, useMonthlyPies, useSearchPies } from './usePies';
import * as pieServiceModule from '../services/pieService';

vi.mock('../services/pieService');

describe('usePies', () => {
  const mockPies = [
    {
      id: '1',
      name: 'Apple',
      price: 10,
      description: 'Desc',
      category: 'fruit' as const,
      image: '/img.jpg',
    },
  ];

  beforeEach(() => {
    vi.mocked(pieServiceModule.pieService.getPies).mockResolvedValue(mockPies);
  });

  it('calls getPies with category and returns data', async () => {
    const { result } = renderHook(() => usePies('fruit'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.getPies).toHaveBeenCalledWith('fruit');
    expect(result.current.pies).toEqual(mockPies);
  });

  it('calls getPies without category when undefined', async () => {
    const { result } = renderHook(() => usePies(undefined));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.getPies).toHaveBeenCalledWith(undefined);
  });
});

describe('useMonthlyPies', () => {
  const mockPies = [
    {
      id: '1',
      name: 'Monthly',
      price: 15,
      description: 'D',
      category: 'seasonal' as const,
      image: '/m.jpg',
    },
  ];

  beforeEach(() => {
    vi.mocked(pieServiceModule.pieService.getMonthlyPies).mockResolvedValue(mockPies);
  });

  it('calls getMonthlyPies and returns data', async () => {
    const { result } = renderHook(() => useMonthlyPies());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.getMonthlyPies).toHaveBeenCalled();
    expect(result.current.pies).toEqual(mockPies);
  });
});

describe('useSearchPies', () => {
  const mockPies = [
    {
      id: '1',
      name: 'Apple',
      price: 10,
      description: 'Desc',
      category: 'fruit' as const,
      image: '/img.jpg',
    },
  ];

  beforeEach(() => {
    vi.mocked(pieServiceModule.pieService.searchPies).mockResolvedValue(mockPies);
  });

  it('returns empty array when query is empty string', async () => {
    const { result } = renderHook(() => useSearchPies('', undefined));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.searchPies).not.toHaveBeenCalled();
    expect(result.current.pies).toEqual([]);
  });

  it('returns empty array when query is only whitespace', async () => {
    const { result } = renderHook(() => useSearchPies('   ', undefined));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.searchPies).not.toHaveBeenCalled();
    expect(result.current.pies).toEqual([]);
  });

  it('calls searchPies when query has content', async () => {
    const { result } = renderHook(() => useSearchPies('apple', 'fruit'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(pieServiceModule.pieService.searchPies).toHaveBeenCalledWith('apple', 'fruit');
    expect(result.current.pies).toEqual(mockPies);
  });
});
