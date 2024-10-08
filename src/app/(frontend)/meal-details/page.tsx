"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function MealDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageUrl = searchParams.get("imageUrl");
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");

  if (!imageUrl) {
    return <div>No image URL provided</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add logic to save the meal details if needed
    // Then navigate to the analysis page
    router.push(
      `/analysis?imageUrl=${encodeURIComponent(imageUrl)}&mealName=${encodeURIComponent(mealName)}&mealDescription=${encodeURIComponent(mealDescription)}`,
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Meal Details
        </h1>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt="Uploaded meal"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="mealName" className="block text-sm font-medium">
              Meal Name
            </label>
            <input
              type="text"
              id="mealName"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label
              htmlFor="mealDescription"
              className="block text-sm font-medium"
            >
              Meal Description
            </label>
            <textarea
              id="mealDescription"
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
          >
            Proceed to Analysis
          </button>
        </form>
      </div>
    </main>
  );
}
