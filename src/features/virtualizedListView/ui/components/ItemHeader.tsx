import { memo } from "react";

type ItemHeaderProps = {
  title: string;
  author: string;
  genre: string;
};

export const ItemHeader = memo(function ItemHeader({
  title,
  author,
  genre,
}: ItemHeaderProps) {
  return (
    <header className="space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <address className="not-italic">
          <span className="font-medium">By: </span>
          {author}
        </address>
        <span aria-hidden="true">•</span>
        <span>
          <span className="font-medium">Genre: </span>
          {genre}
        </span>
      </div>
    </header>
  );
});
