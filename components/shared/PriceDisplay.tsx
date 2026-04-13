interface Props {
  price: number;        // paise
  originalPrice: number; // paise
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PriceDisplay({ price, originalPrice, size = "md", className = "" }: Props) {
  const priceRupees = Math.round(price / 100);
  const originalRupees = Math.round(originalPrice / 100);
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: { price: "text-xl", original: "text-sm", badge: "text-xs" },
    md: { price: "text-3xl", original: "text-base", badge: "text-sm" },
    lg: { price: "text-4xl", original: "text-lg", badge: "text-sm" },
  };

  const cls = sizeClasses[size];

  return (
    <div className={`flex items-end gap-3 flex-wrap ${className}`}>
      <span className={`font-heading font-bold text-navy ${cls.price}`}>
        ₹{priceRupees.toLocaleString("en-IN")}
      </span>
      {discount > 0 && (
        <>
          <span className={`line-through text-muted ${cls.original}`}>
            ₹{originalRupees.toLocaleString("en-IN")}
          </span>
          <span className={`bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full ${cls.badge}`}>
            {discount}% OFF
          </span>
        </>
      )}
    </div>
  );
}
