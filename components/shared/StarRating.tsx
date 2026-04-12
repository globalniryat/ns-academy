import { Star } from "lucide-react";

interface Props {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md";
  className?: string;
}

export default function StarRating({ rating, maxStars = 5, size = "sm", className = "" }: Props) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < rating ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}
