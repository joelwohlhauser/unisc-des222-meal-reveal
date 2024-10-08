"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const mealName = searchParams.get("mealName");
  const mealDescription = searchParams.get("mealDescription");

  if (!imageUrl) {
    return <div>No image URL provided</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Meal Analysis
        </h1>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt="Uploaded meal"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold">Meal Name: {mealName}</h2>
          <p className="mt-2">Description: {mealDescription}</p>
        </div>
        {/* Add more analysis content here */}
      </div>
    </main>
  );
}
