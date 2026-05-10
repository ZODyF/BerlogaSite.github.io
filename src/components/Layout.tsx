import type { ReactNode } from "react";
import { Header } from "./Header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
