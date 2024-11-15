"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { mealHistoryAtom } from "~/lib/atoms";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  format,
  differenceInDays,
} from "date-fns";
import { STORAGE_URL } from "~/lib/config";
import type { AnalyzedMeal } from "~/lib/atoms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import MarkdownContent from "~/components/MarkdownContent";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type GroupedMeals = Record<string, AnalyzedMeal[]>;

export default function HistoryPage() {
  const [mealHistory, setMealHistory] = useAtom(mealHistoryAtom);

  // Calculate today's stats
  const todayStats = mealHistory.reduce(
    (acc, meal) => {
      if (isToday(meal.timestamp) && !meal.nutritionData.error) {
        acc.mealsCount++;
        acc.calories += Number(meal.nutritionData.calories ?? 0);
        acc.protein += Number(meal.nutritionData.protein ?? 0);
        acc.fat += Number(meal.nutritionData.fat ?? 0);
      }
      return acc;
    },
    { mealsCount: 0, calories: 0, protein: 0, fat: 0 },
  );

  // Group meals by relative date
  const groupedMeals = mealHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((groups: GroupedMeals, meal) => {
      let dateKey;
      const daysAgo = differenceInDays(new Date(), meal.timestamp);

      if (isToday(meal.timestamp)) {
        dateKey = "Today";
      } else if (isYesterday(meal.timestamp)) {
        dateKey = "Yesterday";
      } else if (daysAgo < 7) {
        dateKey = formatDistanceToNow(meal.timestamp, { addSuffix: true });
      } else {
        dateKey = format(meal.timestamp, "MMMM d, yyyy");
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey]!.push(meal);
      return groups;
    }, {});

  const handleDeleteMeal = (imageId: string) => {
    setMealHistory(mealHistory.filter((meal) => meal.imageId !== imageId));
  };

  const renderMeal = (meal: AnalyzedMeal) => (
    <div
      key={meal.imageId}
      className="overflow-hidden rounded-lg border border-gray-200 shadow-md"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={`${STORAGE_URL}/${meal.imageId}.jpg`}
          alt="Meal"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>{format(meal.timestamp, "h:mm a")}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this meal?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this meal from your history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteMeal(meal.imageId)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {meal.description && (
          <p className="mb-4 text-gray-700">{meal.description}</p>
        )}
        <div className="space-y-1">
          {meal.nutritionData.error ? (
            <p className="text-red-500">{meal.nutritionData.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                {meal.nutritionData.calories && (
                  <p className="text-gray-900">
                    Calories: {meal.nutritionData.calories}
                  </p>
                )}
                {meal.nutritionData.fat && (
                  <p className="text-gray-900">
                    Fat: {meal.nutritionData.fat}g
                  </p>
                )}
                {meal.nutritionData.protein && (
                  <p className="text-gray-900">
                    Protein: {meal.nutritionData.protein}g
                  </p>
                )}
              </div>
              {meal.nutritionData.breakdown && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="breakdown">
                    <AccordionTrigger>Analysis Breakdown</AccordionTrigger>
                    <AccordionContent>
                      <MarkdownContent
                        className="text-sm"
                        content={meal.nutritionData.breakdown}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg space-y-8 px-4 pb-40 pt-8 md:pt-16">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Meal History
        </h1>

        {/* Today&apos;s Stats Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Today&apos;s Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Meals</p>
              <p className="text-xl font-semibold text-gray-900">
                {todayStats.mealsCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Calories</p>
              <p className="text-xl font-semibold text-gray-900">
                {Math.round(todayStats.calories)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-xl font-semibold text-gray-900">
                {Math.round(todayStats.protein)}g
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Fat</p>
              <p className="text-xl font-semibold text-gray-900">
                {Math.round(todayStats.fat)}g
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {mealHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              No meals analyzed yet. Start by analyzing your first meal!
            </p>
          ) : (
            Object.entries(groupedMeals).map(([dateKey, meals]) => (
              <div key={dateKey} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {dateKey}
                </h2>
                <div className="space-y-6">
                  {meals.map((meal) => renderMeal(meal))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
