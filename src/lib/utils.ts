import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WAITER_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
  "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-teal-500"
];

export function getWaiterBg(color?: string) {
  const map: Record<string, string> = {
    "bg-red-500": "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
    "bg-blue-500": "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
    "bg-green-500": "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
    "bg-yellow-500": "bg-yellow-100 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-300",
    "bg-purple-500": "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
    "bg-pink-500": "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300",
    "bg-orange-500": "bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-300",
    "bg-teal-500": "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300",
  };
  return color && map[color] ? map[color] : "bg-secondary text-secondary-foreground";
}