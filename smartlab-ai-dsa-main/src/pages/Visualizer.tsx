import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DSAVisualizer } from '@/components/visualizer/DSAVisualizer';
import { ExplanationPanel } from '@/components/visualizer/ExplanationPanel';
import { generateVisualization, type VisualizationResponse } from '@/lib/generateVisualization';
import { toast } from 'sonner';

const Visualizer = () => {
  const [problemTitle, setProblemTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [examples, setExamples] = useState('');
  const [constraints, setConstraints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);

  const handleGenerate = async () => {
    if (!problemTitle || !problemStatement) {
      toast.error('Please fill in at least the problem title and statement');
      return;
    }

    setIsLoading(true);
    try {
      let parsedExamples = [];
      try {
        parsedExamples = examples ? JSON.parse(examples) : [];
      } catch {
        parsedExamples = [{ input: examples, output: '', explanation: '' }];
      }

      const result = await generateVisualization({
        problemTitle,
        problemStatement,
        examples: parsedExamples,
        constraints,
      });

      setVisualization(result);
      toast.success('Visualization generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate visualization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            DSA Auto-Visualizer
          </h1>
          <p className="text-muted-foreground">
            AI-powered problem analysis with step-by-step animated visualizations
          </p>
        </div>

        {!visualization ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Enter Problem Details</CardTitle>
              <CardDescription>
                Provide the problem details and let AI generate a comprehensive explanation with visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Two Sum, Container With Most Water"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statement">Problem Statement *</Label>
                <Textarea
                  id="statement"
                  placeholder="Describe the problem in detail..."
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examples">Examples (optional)</Label>
                <Textarea
                  id="examples"
                  placeholder='[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}]'
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints (optional)</Label>
                <Textarea
                  id="constraints"
                  placeholder="e.g., 2 <= nums.length <= 10^4"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Visualization...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Visualization
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{problemTitle}</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setVisualization(null);
                  setProblemTitle('');
                  setProblemStatement('');
                  setExamples('');
                  setConstraints('');
                }}
              >
                New Problem
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="order-2 lg:order-1">
                <ExplanationPanel
                  problemCategory={visualization.problemCategory}
                  simpleExplanation={visualization.simpleExplanation}
                  coreIdea={visualization.coreIdea}
                  stepByStepWalkthrough={visualization.stepByStepWalkthrough}
                  pseudoCode={visualization.pseudoCode}
                />
              </div>

              <div className="order-1 lg:order-2">
                <div className="sticky top-6">
                  <DSAVisualizer visualization={visualization.visualization} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
