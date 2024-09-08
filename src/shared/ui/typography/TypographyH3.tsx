import { cn } from "@/shared/lib/utils";

type TypographyH4Props = {
  text: string;
  className?: string;
};

export function TypographyH3({ text, className }: TypographyH4Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {text}
    </h3>
  );
}
