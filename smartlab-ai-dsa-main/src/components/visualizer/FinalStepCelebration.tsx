import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinalStepCelebrationProps {
  result?: string;
  complexity?: string;
  onReplay: () => void;
}

export const FinalStepCelebration = ({ result, complexity, onReplay }: FinalStepCelebrationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
    >
      <div className="text-center space-y-3 p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-base font-bold text-foreground">Algorithm Complete!</h3>
          
          {result && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Result: {result}
              </span>
            </div>
          )}
        </motion.div>
        
        {complexity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Time: {complexity}</span>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button size="sm" variant="outline" onClick={onReplay} className="mt-2">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Watch Again
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
