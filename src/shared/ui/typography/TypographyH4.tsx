import { cn } from "@/shared/lib/utils";

type TypographyH4Props = {
  text: string;
  className?: string;
};

export function TypographyH4({ text, className }: TypographyH4Props) {
  return (
    <h4
      className={cn(
        "text-xl font-semibold tracking-tight scroll-m-20",
        className
      )}
    >
      {text}
    </h4>
  );
}
