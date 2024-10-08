import Link from "next/link";

export default function MealDetailsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Tell us some details about your meal
        </h1>
        <form className="w-full space-y-6">
          <div>
            <label
              htmlFor="meal-name"
              className="mb-2 block text-sm font-medium"
            >
              Meal name (optional)
            </label>
            <input
              type="text"
              id="meal-name"
              className="w-full rounded-md bg-white px-3 py-2 text-black"
            />
          </div>
          <div>
            <label
              htmlFor="meal-size"
              className="mb-2 block text-sm font-medium"
            >
              Meal size
            </label>
            <input
              type="range"
              id="meal-size"
              min="1"
              max="3"
              step="1"
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-sm">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>
          <Link href="/analysis" className="block w-full">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
            >
              Analyse meal
            </button>
          </Link>
        </form>
      </div>
    </main>
  );
}
