import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#a259ff] text-white border-[1px] border-[#a259ff]", 
  "bg-[#00c851] text-black border-[1px] border-[#00c851]",
  "bg-[#2b7fff] text-black border-[1px] border-[#2b7fff]", 
  "bg-[#ff4444] text-white border-[1px] border-[#ff4444]",
  "bg-[#ff8800] text-black border-[1px] border-[#ff8800]"  
];

export const getColor = (color) => {
  if (color >=0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData
}