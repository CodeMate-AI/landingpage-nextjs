import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges dynamic conditional class names and resolves conflicting Tailwind CSS utility classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
