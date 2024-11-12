"use client";

import { useAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { mealHistoryAtom } from "~/lib/atoms";
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

export default function SettingsPage() {
  const [, setMealHistory] = useAtom(mealHistoryAtom);

  const handleClearHistory = () => {
    setMealHistory([]);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg space-y-8 px-4 pb-16 pt-8 md:pt-16">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Settings
        </h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Data Management</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Clear Meal History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your meal history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </main>
  );
}
