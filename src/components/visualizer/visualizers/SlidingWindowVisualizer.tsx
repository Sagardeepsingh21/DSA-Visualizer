import { motion } from 'framer-motion';

interface SlidingWindowVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    pointerPositions?: Record<string, number>;
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const SlidingWindowVisualizer = ({ data, step, compact = false }: SlidingWindowVisualizerProps) => {
  const highlight = step.highlight || [];
  const pointers = step.pointerPositions || {};
  const windowStart = pointers.start ?? pointers.left ?? 0;
  const windowEnd = pointers.end ?? pointers.right ?? 0;
  const size = compact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Array with window */}
      <div className="flex items-end gap-1.5 flex-wrap justify-center">
        {data.map((value, index) => {
          const inWindow = index >= windowStart && index <= windowEnd;
          const isHighlighted = highlight.includes(index);
          const isStart = index === windowStart;
          const isEnd = index === windowEnd;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Window boundary indicators */}
              <div className="h-4 flex items-center justify-center">
                {isStart && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9px] font-bold text-orange-500"
                  >
                    ┌─
                  </motion.span>
                )}
                {isEnd && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9px] font-bold text-orange-500"
                  >
                    ─┐
                  </motion.span>
                )}
              </div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHighlighted ? 1.1 : 1,
                  opacity: inWindow ? 1 : 0.4,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  ${size} rounded-md flex items-center justify-center
                  font-semibold border-2 transition-all duration-200
                  ${inWindow ? 'bg-orange-500/20 border-orange-500 text-foreground' : 'bg-card border-border'}
                  ${isHighlighted ? 'bg-primary text-primary-foreground border-primary shadow-lg' : ''}
                `}
              >
                {value}
              </motion.div>
              <span className="text-[10px] text-muted-foreground">{index}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-orange-500/50 border border-orange-500" />
          <span className="text-muted-foreground">Window [{windowStart}-{windowEnd}]</span>
        </div>
      </div>
    </div>
  );
};
