import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { TwoPointerVisualizer } from './visualizers/TwoPointerVisualizer';
import { DPTableVisualizer } from './visualizers/DPTableVisualizer';
import { StackVisualizer } from './visualizers/StackVisualizer';
import { SlidingWindowVisualizer } from './visualizers/SlidingWindowVisualizer';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { HashMapVisualizer } from './visualizers/HashMapVisualizer';
import { StockChartVisualizer } from './visualizers/StockChartVisualizer';
import { SubarrayVisualizer } from './visualizers/SubarrayVisualizer';
import { StairsVisualizer } from './visualizers/StairsVisualizer';
import { FinalStepCelebration } from './FinalStepCelebration';
import { CustomInputPanel } from './CustomInputPanel';

interface VisualizationStep {
  description: string;
  highlight?: number[];
  pointerPositions?: Record<string, number>;
  extraInfo?: Record<string, any>;
}

interface VisualizationData {
  type: string;
  data: any[];
  steps: VisualizationStep[];
}

interface DSAVisualizerProps {
  visualization: VisualizationData;
  compact?: boolean;
  showCustomInput?: boolean;
}

export const DSAVisualizer = ({ visualization, compact = false, showCustomInput = true }: DSAVisualizerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [customData, setCustomData] = useState<any[] | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeData = customData || visualization.data;

  const isLastStep = currentStep >= visualization.steps.length - 1;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= visualization.steps.length - 1) {
          setIsPlaying(false);
          setShowCelebration(true);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, visualization.steps.length, speed]);

  // Reset celebration when step changes manually
  useEffect(() => {
    if (currentStep < visualization.steps.length - 1) {
      setShowCelebration(false);
    }
  }, [currentStep, visualization.steps.length]);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(visualization.steps.length - 1, prev + 1));
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowCelebration(false);
  };

  const handleCustomInput = useCallback((data: any[], extraParams?: Record<string, any>) => {
    setCustomData(data);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowCelebration(false);
  }, []);

  const handleSliderChange = (value: number[]) => {
    setCurrentStep(value[0]);
    setIsPlaying(false);
  };

  const currentStepData = visualization.steps[currentStep];

  // Extract result from last step for celebration
  const lastStep = visualization.steps[visualization.steps.length - 1];
  const resultInfo = lastStep?.extraInfo?.result || lastStep?.extraInfo?.maxProfit?.toString() || lastStep?.extraInfo?.ways?.toString();

  const renderVisualizer = () => {
    const props = {
      data: activeData,
      step: currentStepData,
      currentStep,
      compact,
    };

    switch (visualization.type) {
      case 'two_pointers':
        return <TwoPointerVisualizer {...props} />;
      case 'dp_table':
        return <DPTableVisualizer {...props} />;
      case 'stack':
        return <StackVisualizer {...props} />;
      case 'sliding_window':
        return <SlidingWindowVisualizer {...props} />;
      case 'hash_map':
        return <HashMapVisualizer {...props} />;
      case 'stock_chart':
        return <StockChartVisualizer {...props} />;
      case 'subarray':
        return <SubarrayVisualizer {...props} />;
      case 'stairs':
        return <StairsVisualizer {...props} />;
      case 'array':
      default:
        return <ArrayVisualizer {...props} />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Custom Input Panel */}
      {showCustomInput && (
        <CustomInputPanel
          visualizationType={visualization.type}
          onApplyInput={handleCustomInput}
          defaultData={visualization.data}
        />
      )}

      {/* Visualization Area */}
      <div className={`bg-card rounded-lg border flex items-center justify-center relative ${compact ? 'p-4 min-h-[180px]' : 'p-6 min-h-[250px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${JSON.stringify(activeData)}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderVisualizer()}
          </motion.div>
        </AnimatePresence>
        
        {/* Final Step Celebration Overlay */}
        {showCelebration && isLastStep && (
          <FinalStepCelebration
            result={resultInfo}
            onReplay={handleReset}
          />
        )}
      </div>

      {/* Step Info */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-primary">
            Step {currentStep + 1}/{visualization.steps.length}
          </span>
          {currentStepData.extraInfo && (
            <div className="flex gap-1">
              {Object.entries(currentStepData.extraInfo).slice(0, 3).map(([key, value]) => (
                <span
                  key={key}
                  className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {currentStepData.description}
        </p>
      </div>

      {/* Timeline Slider */}
      <Slider
        value={[currentStep]}
        max={visualization.steps.length - 1}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={currentStep === 0}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="h-8 w-8 p-0"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (isLastStep && !isPlaying) {
              handleReset();
              setIsPlaying(true);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          className="h-8 px-4"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentStep === visualization.steps.length - 1}
          className="h-8 w-8 p-0"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
