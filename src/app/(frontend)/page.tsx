"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

const exampleMeals = [
  { name: "pasta", calories: 655, fat: 31, protein: 32 },
  { name: "salad", calories: 385, fat: 12, protein: 13 },
  { name: "bowl", calories: 779, fat: 47, protein: 34 },
  { name: "wrap", calories: 722, fat: 37, protein: 40 },
];

export default function HomePage() {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMealIndex((prevIndex) => (prevIndex + 1) % exampleMeals.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentMeal = exampleMeals[currentMealIndex];

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg space-y-8 px-4 pb-16 pt-8 md:pt-16">
        <div className="space-y-6">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to MealReveal
          </h1>
          <p className="text-center text-xl text-gray-600">
            Stop calorie counting. Just snap a picture of your meal!
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-gray-200 shadow-lg">
          <div className="overflow-hidden rounded-t-2xl">
            <Image
              src={`/example-meals/${currentMeal?.name}.webp`}
              alt={`Example ${currentMeal?.name} meal`}
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <div className="p-4">
            <h2 className="mb-2 text-2xl font-semibold capitalize">
              Nutrition Facts
            </h2>
            <p>Calories: {currentMeal?.calories}</p>
            <p>Fat: {currentMeal?.fat}g</p>
            <p>Protein: {currentMeal?.protein}g</p>
          </div>
        </div>
        <Link href="/analysis" className="block w-full">
          <Button className="w-full">Let&apos;s get started</Button>
        </Link>
      </div>
    </main>
  );
}
