import { atomWithStorage } from 'jotai/utils';

export interface AnalyzedMeal {
  imageId: string;
  description: string;
  analysis: string[];
  timestamp: number;
}

export const mealHistoryAtom = atomWithStorage<AnalyzedMeal[]>('mealHistory', []);