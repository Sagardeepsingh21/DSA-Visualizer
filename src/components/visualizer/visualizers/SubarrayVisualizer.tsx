import { motion } from 'framer-motion';

interface SubarrayVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    pointerPositions?: Record<string, number>;
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const SubarrayVisualizer = ({ data, step, compact = false }: SubarrayVisualizerProps) => {
  const highlight = step.highlight || [];
  const pointers = step.pointerPositions || {};
  const extraInfo = step.extraInfo || {};
  const size = compact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

  const isInSubarray = (index: number) => {
    if (pointers.start === undefined) return false;
    const end = pointers.end ?? pointers.current ?? pointers.start;
    return index >= pointers.start && index <= end;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Array visualization */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {data.map((value, index) => {
          const isHighlighted = highlight.includes(index);
          const inSubarray = isInSubarray(index);
          const isCurrent = pointers.current === index;
          const isStart = pointers.start === index;
          const isEnd = pointers.end === index;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Position indicators */}
              <div className="h-4 flex items-center justify-center">
                {isCurrent && (
                  <motion.span
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] font-bold text-primary"
                  >
                    ↓
                  </motion.span>
                )}
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isHighlighted ? 1.1 : 1,
                }}
                className={`
                  ${size} rounded-md flex items-center justify-center
                  font-bold border-2 transition-all duration-200
                  ${isHighlighted 
                    ? 'bg-green-500 text-white border-green-500 shadow-lg' 
                    : inSubarray 
                      ? 'bg-primary/20 border-primary text-foreground'
                      : value < 0 
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : 'bg-card border-border text-foreground'}
                `}
              >
                {value}
              </motion.div>
              <span className="text-[10px] text-muted-foreground">{index}</span>
            </div>
          );
        })}
      </div>

      {/* Running sum indicator */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        <div className={`px-3 py-1.5 rounded-full font-medium ${
          Number(extraInfo.currentSum) > 0 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-red-500/10 text-red-500'
        }`}>
          📊 Current Sum: {extraInfo.currentSum ?? 0}
        </div>
        <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-bold">
          🏆 Max Sum: {extraInfo.maxSum ?? '-'}
        </div>
        {extraInfo.action && (
          <div className="px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full">
            {extraInfo.action}
          </div>
        )}
        {extraInfo.result && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full font-bold"
          >
            ✅ {extraInfo.result}
          </motion.div>
        )}
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Best Subarray</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500/30" />
          <span>Negative</span>
        </div>
      </div>
    </div>
  );
};
