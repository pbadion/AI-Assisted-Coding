import { useState, useEffect, useCallback } from 'react';
import { Pie, UsePiesReturn } from '../types/pie';

/**
 * Generic hook that wraps any async pie-fetching function with
 * loading / error / refetch state. All three pie hooks delegate here.
 */
export const useFetchPies = (
  fetcher: () => Promise<Pie[]>,
  deps: unknown[] = [],
): UsePiesReturn => {
  const [pies, setPies] = useState<Pie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetcher();
      setPies(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch pies';
      setError(errorMessage);
      console.error('Error fetching pies:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { pies, loading, error, refetch: fetchData };
};
