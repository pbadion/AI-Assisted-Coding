import { pieService } from '../services/pieService';
import { UsePiesReturn } from '../types/pie';
import { useFetchPies } from './useFetchPies';

export const usePies = (category?: string): UsePiesReturn =>
  useFetchPies(() => pieService.getPies(category), [category]);

export const useMonthlyPies = (): UsePiesReturn =>
  useFetchPies(() => pieService.getMonthlyPies(), []);

export const useSearchPies = (query: string, category?: string): UsePiesReturn =>
  useFetchPies(
    async () => {
      if (!query.trim()) return [];
      return pieService.searchPies(query, category);
    },
    [query, category],
  );
