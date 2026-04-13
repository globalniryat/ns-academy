interface Props {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  align = "center",
  className = "",
}: Props) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold text-blue uppercase tracking-widest px-3 py-1 bg-blue/10 rounded-full">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-tight">
        {heading}
      </h2>
      {subtitle && (
        <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
