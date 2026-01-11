import { motion } from 'framer-motion';

interface HashMapVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    pointerPositions?: Record<string, number>;
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const HashMapVisualizer = ({ data, step, compact = false }: HashMapVisualizerProps) => {
  const highlight = step.highlight || [];
  const pointers = step.pointerPositions || {};
  const extraInfo = step.extraInfo || {};
  const size = compact ? 'w-12 h-12 text-base' : 'w-14 h-14 text-lg';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Array visualization */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Array (nums)</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {data.map((value, index) => {
            const isHighlighted = highlight.includes(index);
            const isCurrent = pointers.current === index;

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                {isCurrent && (
                  <motion.div
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xs font-bold text-primary"
                  >
                    ↓ checking
                  </motion.div>
                )}
                {!isCurrent && <div className="h-4" />}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: isHighlighted ? 1.1 : 1,
                    opacity: 1,
                  }}
                  className={`
                    ${size} rounded-lg flex items-center justify-center font-bold
                    border-2 transition-all duration-300
                    ${isHighlighted 
                      ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30' 
                      : isCurrent 
                        ? 'bg-primary/20 border-primary text-foreground'
                        : 'bg-card border-border text-foreground'}
                  `}
                >
                  {value}
                </motion.div>
                <span className="text-[10px] text-muted-foreground">i={index}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hash Map visualization */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <span className="text-xs font-medium text-muted-foreground">Memory (Hash Map)</span>
        <motion.div 
          className="bg-muted/30 rounded-lg p-3 min-w-[150px] border border-border"
          layout
        >
          <pre className="text-sm font-mono text-center">
            {extraInfo.memory || '{}'}
          </pre>
        </motion.div>
      </div>

      {/* Info badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {extraInfo.target !== undefined && (
          <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
            🎯 Target: {extraInfo.target}
          </div>
        )}
        {extraInfo.looking_for !== undefined && extraInfo.looking_for !== '-' && (
          <div className="px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full font-medium">
            🔍 Need: {extraInfo.looking_for}
          </div>
        )}
        {extraInfo.found && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full font-bold"
          >
            ✅ {extraInfo.found}
          </motion.div>
        )}
      </div>
    </div>
  );
};
