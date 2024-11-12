"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { mealHistoryAtom } from "~/lib/atoms";
import { formatDistanceToNow } from "date-fns";
import { STORAGE_URL } from "~/lib/config";

export default function HistoryPage() {
  const [mealHistory] = useAtom(mealHistoryAtom);

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg space-y-8 px-4 pb-16 pt-8 md:pt-16">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Meal History
        </h1>

        <div className="space-y-6">
          {mealHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              No meals analyzed yet. Start by analyzing your first meal!
            </p>
          ) : (
            mealHistory
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((meal) => (
                <div
                  key={meal.imageId}
                  className="overflow-hidden rounded-lg border border-gray-200 shadow-md"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={`${STORAGE_URL}/${meal.imageId}.jpg`}
                      alt="Meal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 text-sm text-gray-500">
                      {formatDistanceToNow(meal.timestamp, { addSuffix: true })}
                    </div>
                    {meal.description && (
                      <p className="mb-3 text-gray-700">{meal.description}</p>
                    )}
                    <div className="space-y-1">
                      {meal.analysis.map((item, index) => (
                        <p key={index} className="text-gray-900">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  );
}
