import { motion } from 'framer-motion';

interface ArrayVisualizerProps {
  data: any[];
  step: {
    highlight?: number[];
    extraInfo?: Record<string, any>;
  };
  compact?: boolean;
}

export const ArrayVisualizer = ({ data, step, compact = false }: ArrayVisualizerProps) => {
  const highlight = step.highlight || [];
  const size = compact ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: highlight.includes(index) ? 1.1 : 1,
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`
              ${size} rounded-md flex items-center justify-center
              font-semibold border-2 transition-all duration-200
              ${
                highlight.includes(index)
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-card text-foreground border-border'
              }
            `}
          >
            {value}
          </div>
          <span className="text-[10px] text-muted-foreground">{index}</span>
        </motion.div>
      ))}
    </div>
  );
};
