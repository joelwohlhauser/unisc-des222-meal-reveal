import { atomWithStorage } from 'jotai/utils';

export interface NutritionResponse {
  calories?: number;
  fat?: number;
  protein?: number;
  error?: string;
}

export interface AnalyzedMeal {
  imageId: string;
  description: string;
  timestamp: number;
  nutritionData: NutritionResponse;
}

export const mealHistoryAtom = atomWithStorage<AnalyzedMeal[]>('mealHistory', []);