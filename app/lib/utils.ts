import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// type ClassValue = boolean | number | string | Record<string, boolean | number>

// export function cn(...inputs: ClassValue[]) {
//   let input: ClassValue;
//   const output: string[] = [];
//   for (let i = 0; i < inputs.length; i++) {
//     input = inputs[i]!;

//     if (typeof input === "string") {
//       output.push(input)
//     } else if (typeof input === "object") {
//       for (const k in input) {
//         input[k] && output.push(k);
//       }
//     }
//   }

//   return output.join(' ');
// }

export function formatDuration(minutes: number) {
	const hours = Math.floor(minutes / 60);
	const remainder = minutes % 60;
	return hours
		? `${hours} hr${hours > 1 ? 's' : ''} ${remainder > 0 ? `${remainder} min` : ""}`
		: `${minutes} min`;
}