import { cn } from '@/shared/lib/utils';

type TypographyPProps = {
  text: string;
  className?: string;
};

export function TypographyP({ text, className }: TypographyPProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {text}
    </p>
  );
}
