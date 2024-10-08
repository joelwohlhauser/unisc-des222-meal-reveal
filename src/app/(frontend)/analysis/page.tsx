"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const mealName = searchParams.get("mealName");
  const mealDescription = searchParams.get("mealDescription");

  if (!imageUrl) {
    return <div>No image URL provided</div>;
  }

  return (
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

      <Link href="/take-picture" className="w-full">
        <button className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600">
          Take Another Picture
        </button>
      </Link>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <AnalysisContent />
      </Suspense>
    </main>
  );
}
