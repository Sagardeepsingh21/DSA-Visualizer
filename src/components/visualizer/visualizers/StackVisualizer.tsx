import { motion, AnimatePresence } from 'framer-motion';

interface StackVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    extraInfo?: Record<string, any>;
  };
  currentStep: number;
  compact?: boolean;
}

export const StackVisualizer = ({ data, step, currentStep, compact = false }: StackVisualizerProps) => {
  const highlight = step.highlight || [];
  const visibleCount = (step.extraInfo?.stackSize as number) ?? data.length;
  const visibleData = data.slice(0, visibleCount);
  const size = compact ? 'h-7 min-w-[36px] text-xs' : 'h-9 min-w-[48px] text-sm';

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] text-muted-foreground font-medium">TOP ↓</span>
      
      <div className="flex flex-col-reverse items-center gap-0.5 p-2 border border-dashed border-border rounded-md min-h-[80px]">
        <AnimatePresence mode="popLayout">
          {visibleData.length === 0 ? (
            <span className="text-[10px] text-muted-foreground py-4">Empty</span>
          ) : (
            visibleData.map((value, index) => {
              const isTop = index === visibleData.length - 1;
              const isHighlighted = highlight.includes(index);

              return (
                <motion.div
                  key={`${index}-${currentStep}`}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    ${size} px-3 rounded flex items-center justify-center
                    font-semibold border-2 transition-all
                    ${isTop ? 'bg-primary text-primary-foreground border-primary shadow-md' : ''}
                    ${isHighlighted && !isTop ? 'bg-secondary text-secondary-foreground border-secondary' : ''}
                    ${!isHighlighted && !isTop ? 'bg-card text-foreground border-border' : ''}
                  `}
                >
                  {value}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      
      <div className="w-20 h-1 bg-muted rounded-full" />
      <span className="text-[10px] text-muted-foreground">BASE</span>
    </div>
  );
};
