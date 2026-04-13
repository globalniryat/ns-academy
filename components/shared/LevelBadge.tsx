import { Badge } from "@/components/ui/badge";

type LevelVariant = "foundation" | "intermediate" | "final";

const variantMap: Record<string, LevelVariant> = {
  FOUNDATION: "foundation",
  INTERMEDIATE: "intermediate",
  FINAL: "final",
};

const labelMap: Record<string, string> = {
  FOUNDATION: "Foundation",
  INTERMEDIATE: "Intermediate",
  FINAL: "Final",
};

interface Props {
  level: string;
  className?: string;
}

export default function LevelBadge({ level, className }: Props) {
  return (
    <Badge
      variant={variantMap[level] ?? "foundation"}
      className={className}
    >
      {labelMap[level] ?? level}
    </Badge>
  );
}
