import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg px-4 py-16">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to MealReveal
        </h1>
        <p className="mb-12 text-center text-xl text-gray-600">
          Stop calorie counting. Just snap a picture of your meal!
        </p>
        <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/example-meals/pasta.webp"
            alt="Example meal"
            width={800}
            height={600}
            layout="responsive"
            objectFit="cover"
          />
        </div>
        <div className="mb-8 rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Sample Analysis</h2>
          <p>Calories: 520</p>
          <p>Fat: 15g</p>
          <p>Protein: 20g</p>
        </div>
        <Link href="/analysis" className="block w-full">
          <button className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-700">
            Let&apos;s get started
          </button>
        </Link>
      </div>
    </main>
  );
}
