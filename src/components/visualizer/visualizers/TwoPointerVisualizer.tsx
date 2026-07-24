import { motion } from 'framer-motion';

interface TwoPointerVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    pointerPositions?: Record<string, number>;
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const TwoPointerVisualizer = ({ data, step, compact = false }: TwoPointerVisualizerProps) => {
  const highlight = step.highlight || [];
  const pointers = step.pointerPositions || {};
  const size = compact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Array with pointers */}
      <div className="flex items-end gap-1.5 flex-wrap justify-center">
        {data.map((value, index) => {
          const isLeft = pointers.left === index;
          const isRight = pointers.right === index;
          const isHighlighted = highlight.includes(index);

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Pointer indicators */}
              <div className="h-5 flex items-center justify-center">
                {isLeft && (
                  <motion.span
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] font-bold text-green-500"
                  >
                    L↓
                  </motion.span>
                )}
                {isRight && (
                  <motion.span
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[10px] font-bold text-blue-500"
                  >
                    R↓
                  </motion.span>
                )}
              </div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHighlighted || isLeft || isRight ? 1.05 : 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  ${size} rounded-md flex items-center justify-center
                  font-semibold border-2 transition-all duration-200
                  ${isLeft ? 'bg-green-500 text-white border-green-500 shadow-md' : ''}
                  ${isRight && !isLeft ? 'bg-blue-500 text-white border-blue-500 shadow-md' : ''}
                  ${isHighlighted && !isLeft && !isRight ? 'bg-primary text-primary-foreground border-primary' : ''}
                  ${!isHighlighted && !isLeft && !isRight ? 'bg-card text-foreground border-border' : ''}
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
          <div className="w-2.5 h-2.5 rounded bg-green-500" />
          <span className="text-muted-foreground">Left</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-blue-500" />
          <span className="text-muted-foreground">Right</span>
        </div>
      </div>
    </div>
  );
};
