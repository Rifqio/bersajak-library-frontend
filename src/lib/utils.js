import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getIndexFromKey = (options, key) => {
  return options.findIndex((option) => option.key === key);
};