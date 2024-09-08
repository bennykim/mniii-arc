import { cn } from "@/shared/lib/utils";

type TypographySpanProps = {
  text: string;
  className?: string;
};

export function TypographySpan({ text, className }: TypographySpanProps) {
  return <span className={cn("leading-4", className)}>{text}</span>;
}
