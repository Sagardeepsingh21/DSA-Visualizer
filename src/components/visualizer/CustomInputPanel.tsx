import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Wand2 } from 'lucide-react';

interface CustomInputPanelProps {
  visualizationType: string;
  onApplyInput: (data: any[], extraParams?: Record<string, any>) => void;
  defaultData: any[];
}

export const CustomInputPanel = ({ visualizationType, onApplyInput, defaultData }: CustomInputPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [targetValue, setTargetValue] = useState('');

  const parseArrayInput = (value: string): number[] => {
    return value
      .replace(/[\[\]]/g, '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n));
  };

  const handleApply = () => {
    const parsed = parseArrayInput(inputValue);
    if (parsed.length === 0) return;

    const extraParams: Record<string, any> = {};
    if (targetValue && !isNaN(Number(targetValue))) {
      extraParams.target = Number(targetValue);
    }

    onApplyInput(parsed, extraParams);
  };

  const handleReset = () => {
    setInputValue('');
    setTargetValue('');
    onApplyInput(defaultData);
  };

  const getPlaceholder = () => {
    switch (visualizationType) {
      case 'hash_map':
        return 'e.g., 2, 7, 11, 15';
      case 'stock_chart':
        return 'e.g., 7, 1, 5, 3, 6, 4';
      case 'subarray':
        return 'e.g., -2, 1, -3, 4, -1, 2, 1';
      case 'stairs':
        return 'e.g., 5 (number of stairs)';
      case 'stack':
        return 'e.g., (, [, ], )';
      default:
        return 'e.g., 1, 2, 3, 4, 5';
    }
  };

  const needsTarget = visualizationType === 'hash_map' || visualizationType === 'two_pointers';

  return (
    <Card className="p-3 bg-muted/30 border-dashed">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-primary" />
        <Label className="text-xs font-medium">Try Your Own Input</Label>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[120px]">
          <Input
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        
        {needsTarget && (
          <div className="w-20">
            <Input
              placeholder="Target"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="h-8 text-xs"
              type="number"
            />
          </div>
        )}
        
        <Button size="sm" className="h-8 px-3" onClick={handleApply} disabled={!inputValue.trim()}>
          <Play className="w-3 h-3 mr-1" />
          Apply
        </Button>
        
        <Button size="sm" variant="ghost" className="h-8 px-2" onClick={handleReset}>
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-1.5">
        Enter comma-separated values to visualize with your own data
      </p>
    </Card>
  );
};
