import { motion } from 'framer-motion';

interface StairsVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const StairsVisualizer = ({ data, step, compact = false }: StairsVisualizerProps) => {
  const highlight = step.highlight || [];
  const extraInfo = step.extraInfo || {};
  const currentStep = extraInfo.step ?? 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stairs visualization */}
      <div className="flex items-end gap-1">
        {data.map((ways, index) => {
          const stepNum = index + 1;
          const isHighlighted = highlight.includes(index);
          const isCurrent = stepNum === currentStep;
          const height = 30 + index * 20;

          return (
            <motion.div
              key={index}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isHighlighted || stepNum <= currentStep ? height : height * 0.3,
                opacity: 1 
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                w-14 rounded-t-md flex flex-col items-center justify-start pt-2
                border-2 transition-colors duration-300
                ${isCurrent 
                  ? 'bg-primary border-primary' 
                  : isHighlighted 
                    ? 'bg-primary/30 border-primary/50'
                    : 'bg-muted/50 border-border'}
              `}
            >
              <span className={`text-lg font-bold ${isCurrent ? 'text-primary-foreground' : 'text-foreground'}`}>
                {ways}
              </span>
              <span className={`text-[10px] ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                ways
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex gap-1">
        {data.map((_, index) => (
          <div key={index} className="w-14 text-center">
            <span className="text-xs text-muted-foreground">Step {index + 1}</span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {currentStep > 0 && (
          <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
            🪜 Step {currentStep}: {extraInfo.ways} ways
          </div>
        )}
        {extraInfo.formula && (
          <div className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full">
            📐 {extraInfo.formula}
          </div>
        )}
        {extraInfo.paths && (
          <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full">
            {extraInfo.paths}
          </div>
        )}
      </div>

      {/* Formula explanation */}
      <div className="text-center text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 max-w-xs">
        <span className="font-mono">ways(n) = ways(n-1) + ways(n-2)</span>
        <br />
        <span>Like Fibonacci! Each step = sum of previous two.</span>
      </div>
    </div>
  );
};
