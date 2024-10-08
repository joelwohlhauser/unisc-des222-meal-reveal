import Image from "next/image";
import Link from "next/link";

export default function AnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Meal details
        </h1>
        <div className="relative aspect-square w-full">
          <Image
            src="/example-meals/pasta.webp"
            alt="Analyzed meal"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="w-full rounded-lg bg-white p-4 text-black">
          <p>Calories: 520</p>
          <p>Fat: 15g</p>
          <p>Protein: 20g</p>
        </div>
        <Link href="/take-picture" className="w-full">
          <button className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600">
            Analyse another meal
          </button>
        </Link>
      </div>
    </main>
  );
}
