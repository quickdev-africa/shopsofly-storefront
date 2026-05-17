import React from "react";

export default function StarRating({ rating, count, size = "sm" }: {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}) {
  if (!rating || rating === 0) return null;

  const sizes = {
    sm: { star: "text-sm", text: "text-xs" },
    md: { star: "text-base", text: "text-sm" },
    lg: { star: "text-xl", text: "text-base" },
  };

  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className={"flex " + sizes[size].star}>
        {Array.from({ length: full }).map((_, i) => (
          <span key={"f" + i} className="text-yellow-400">★</span>
        ))}
        {half && <span className="text-yellow-300">★</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={"e" + i} className="text-gray-200">★</span>
        ))}
      </div>
      <span className={"text-gray-500 " + sizes[size].text}>
        {rating.toFixed(1)}{count ? ` (${count} reviews)` : ""}
      </span>
    </div>
  );
}
