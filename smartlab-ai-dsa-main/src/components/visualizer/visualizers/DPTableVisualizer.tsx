import { motion } from 'framer-motion';

interface DPTableVisualizerProps {
  data: any[][];
  step: {
    highlight?: number[];
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const DPTableVisualizer = ({ data, step, compact = false }: DPTableVisualizerProps) => {
  const highlight = step.highlight || [];
  const size = compact ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs';

  // Handle case where data might be 1D array
  const tableData = Array.isArray(data[0]) ? data : [data];

  return (
    <div className="flex flex-col items-center gap-2 overflow-x-auto">
      <div className="inline-flex flex-col gap-0.5 p-2 bg-muted/20 rounded-md">
        {tableData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5 items-center">
            {/* Row index */}
            <div className={`w-5 flex items-center justify-center text-[9px] text-muted-foreground`}>
              {rowIndex}
            </div>
            {row.map((value, colIndex) => {
              const cellIndex = rowIndex * row.length + colIndex;
              const isHighlighted = highlight.includes(cellIndex);

              return (
                <motion.div
                  key={colIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isHighlighted ? 1.1 : 1,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`
                    ${size} rounded flex items-center justify-center
                    font-semibold border transition-all duration-200
                    ${
                      isHighlighted
                        ? 'bg-primary text-primary-foreground border-primary shadow-md z-10'
                        : 'bg-card text-foreground border-border'
                    }
                  `}
                >
                  {value}
                </motion.div>
              );
            })}
          </div>
        ))}
        {/* Column indices */}
        <div className="flex gap-0.5">
          <div className="w-5" />
          {tableData[0]?.map((_, colIndex) => (
            <div
              key={colIndex}
              className={`${size} flex items-center justify-center text-[9px] text-muted-foreground`}
            >
              {colIndex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
