"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, History, Settings } from "lucide-react";
import { cn } from "~/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-lg">
        <Link
          href="/analyse"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-4",
            pathname === "/analyse" ? "" : "text-gray-500 hover:text-gray-700",
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center rounded-full px-6 py-2",
              pathname === "/analyse" ? "bg-black text-white" : "",
            )}
          >
            <Camera className="h-6 w-6" />
          </div>
          <span className="mt-1 text-xs text-black">Analyse</span>
        </Link>
        <Link
          href="/history"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-4",
            pathname === "/history" ? "" : "text-gray-500 hover:text-gray-700",
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center rounded-full px-6 py-2",
              pathname === "/history" ? "bg-black text-white" : "",
            )}
          >
            <History className="h-6 w-6" />
          </div>
          <span className="mt-1 text-xs text-black">History</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-4",
            pathname === "/settings" ? "" : "text-gray-500 hover:text-gray-700",
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center rounded-full px-6 py-2",
              pathname === "/settings" ? "bg-black text-white" : "",
            )}
          >
            <Settings className="h-6 w-6" />
          </div>
          <span className="mt-1 text-xs text-black">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
