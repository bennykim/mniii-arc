interface TimelineReadUpToHereProps {
  elapsedTime: string | null;
  isVisible: boolean;
}

export const TimelineReadUpToHere: React.FC<TimelineReadUpToHereProps> = ({
  elapsedTime,
  isVisible,
}) => {
  if (!elapsedTime || !isVisible) return null;

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative px-4 text-xs text-center text-gray-500 bg-white">
        Read up to here {elapsedTime}
      </div>
    </div>
  );
};
