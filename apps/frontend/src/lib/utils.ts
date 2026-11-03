import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const rootDomain = "secretterminal.com";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
