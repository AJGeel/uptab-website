import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// `inputs` is a variable, not a class name
// eslint-disable-next-line tailwindcss/no-custom-classname
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
