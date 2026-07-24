import { motion } from 'framer-motion';

interface StockChartVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    pointerPositions?: Record<string, number>;
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const StockChartVisualizer = ({ data, step, compact = false }: StockChartVisualizerProps) => {
  const highlight = step.highlight || [];
  const pointers = step.pointerPositions || {};
  const extraInfo = step.extraInfo || {};
  
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart */}
      <div className="flex items-end gap-2 h-32 px-4">
        {data.map((value, index) => {
          const height = ((value - minVal) / range) * 100 + 20;
          const isHighlighted = highlight.includes(index);
          const isMinDay = pointers.minDay === index;
          const isSellDay = pointers.sellDay === index;
          const isCurrent = pointers.current === index;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ duration: 0.3 }}
                className={`
                  w-10 rounded-t-md flex items-start justify-center pt-1
                  transition-all duration-300 relative
                  ${isMinDay && isSellDay ? 'bg-purple-500' :
                    isMinDay ? 'bg-green-500' : 
                    isSellDay ? 'bg-blue-500' :
                    isCurrent ? 'bg-primary' :
                    isHighlighted ? 'bg-primary/50' : 'bg-muted'}
                `}
              >
                <span className={`text-xs font-bold ${isMinDay || isSellDay || isCurrent ? 'text-white' : 'text-foreground'}`}>
                  ${value}
                </span>
              </motion.div>
              <span className="text-[10px] text-muted-foreground">Day {index + 1}</span>
              {isMinDay && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-green-500"
                >
                  BUY
                </motion.span>
              )}
              {isSellDay && !isMinDay && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-blue-500"
                >
                  SELL
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        <div className="px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full font-medium">
          📉 Min: ${extraInfo.minPrice || '-'}
        </div>
        <div className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-full font-medium">
          💰 Max Profit: ${extraInfo.maxProfit || 0}
        </div>
        {extraInfo.profit && (
          <div className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full">
            Current: {extraInfo.profit}
          </div>
        )}
        {extraInfo.result && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full font-bold"
          >
            ✅ {extraInfo.result}
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Buy Day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span>Sell Day</span>
        </div>
      </div>
    </div>
  );
};
