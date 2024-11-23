import { Dot, MoveLeft, MoveRight } from 'lucide-react';

export const ScrollIndicator = () => {
  return (
    <div className="inline-flex flex-col items-center justify-center animate-pulse">
      <span className="text-xs font-semibold">Wheel Scroll</span>
      <div className="flex items-center">
        <MoveLeft size={18} />
        <Dot size={24} />
        <MoveRight size={18} />
      </div>
    </div>
  );
};
