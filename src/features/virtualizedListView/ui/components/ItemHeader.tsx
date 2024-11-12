import { memo } from 'react';

type ItemHeaderProps = {
  title: string;
  author?: string;
  description?: string;
};

export const ItemHeader = memo(function ItemHeader({
  title,
  author,
  description,
}: ItemHeaderProps) {
  return (
    <header className="space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {author && (
          <span>
            <span className="font-medium">Author: </span>
            {author}
          </span>
        )}
        {description && (
          <>
            <span aria-hidden="true">•</span>
            <span>
              <span className="font-medium">Description: </span>
              {description}
            </span>
          </>
        )}
      </div>
    </header>
  );
});
