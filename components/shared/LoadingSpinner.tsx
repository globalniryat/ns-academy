interface Props {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingSpinner({ size = "md", fullScreen = false, className = "" }: Props) {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  }[size];

  const spinner = (
    <div
      className={`${sizeClass} border-blue border-t-transparent rounded-full animate-spin ${className}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        {spinner}
      </div>
    );
  }

  return spinner;
}
