import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Play, Loader2, Sparkles, Code, FileText, Eye, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { DSAVisualizer } from '@/components/visualizer/DSAVisualizer';
import { ExplanationPanel } from '@/components/visualizer/ExplanationPanel';
import { generateVisualization, type VisualizationResponse } from '@/lib/generateVisualization';
import { getPrebuiltVisualization } from '@/lib/prebuiltVisualizations';

interface Problem {
  id: string;
  problem_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  statement: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string;
  tags: string[];
  starter_code: Record<string, string>;
}

const ProblemDetail = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);
  const [isGeneratingViz, setIsGeneratingViz] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchProblem();
      checkIfSolved();
    }
  }, [problemId, user]);

  const fetchProblem = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('problem_id', problemId)
      .single();

    if (!error && data) {
      const problemData: Problem = {
        id: data.id,
        problem_id: data.problem_id,
        title: data.title,
        difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard',
        category: data.category,
        statement: data.statement,
        examples: data.examples as Array<{ input: string; output: string; explanation?: string }>,
        constraints: data.constraints || '',
        tags: data.tags || [],
        starter_code: data.starter_code as Record<string, string>,
      };
      setProblem(problemData);
      setCode(problemData.starter_code[language] || '// Write your code here');
    }
    setLoading(false);
  };

  const checkIfSolved = async () => {
    if (!user || !problemId) return;
    const { data } = await supabase
      .from('solved_problems')
      .select('id')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .single();
    setIsSolved(!!data);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starter_code[newLang]) {
      setCode(problem.starter_code[newLang]);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, language },
      });

      if (error) throw error;
      setOutput(data.output || data.error || 'No output');
      
      // Check if output indicates success (basic check)
      if (data.output && !data.error && user && problem) {
        // Save as solved
        await supabase.from('solved_problems').upsert({
          user_id: user.id,
          problem_id: problem.problem_id,
          problem_title: problem.title,
          language,
          solution_code: code,
        }, { onConflict: 'user_id,problem_id' });
        
        setIsSolved(true);
        toast.success('Solution saved!');
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error executing code');
      toast.error('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const generateViz = async () => {
    if (!problem) return;
    
    // Try prebuilt visualization first (instant!)
    const prebuilt = getPrebuiltVisualization(problem.problem_id);
    if (prebuilt) {
      setVisualization(prebuilt);
      setActiveTab('visualization');
      toast.success('Visualization loaded!');
      return;
    }

    // Fallback to AI generation
    setIsGeneratingViz(true);
    try {
      const result = await generateVisualization({
        problemTitle: problem.title,
        problemStatement: problem.statement,
        examples: problem.examples,
        constraints: problem.constraints,
      });
      setVisualization(result);
      setActiveTab('visualization');
      toast.success('Visualization generated!');
    } catch (error) {
      console.error('Error generating visualization:', error);
      toast.error('Failed to generate visualization');
    } finally {
      setIsGeneratingViz(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Problem not found</h1>
        <Button onClick={() => navigate('/problems')}>Back to Problems</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/problems')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold">{problem.title}</h1>
              {isSolved && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={generateViz}
              disabled={isGeneratingViz}
            >
              {isGeneratingViz ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {visualization ? 'Regenerate' : 'Visualize'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Problem Description & Visualization */}
        <div className="w-full lg:w-1/2 border-r border-border/50 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent h-12 px-4">
              <TabsTrigger value="description" className="gap-2">
                <FileText className="w-4 h-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="visualization" className="gap-2" disabled={!visualization}>
                <Eye className="w-4 h-4" />
                Visualization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 p-6 overflow-auto m-0">
              <div className="space-y-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {/* Problem Statement */}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{problem.statement}</p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Examples</h3>
                  {problem.examples.map((example, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="pt-4 space-y-2 font-mono text-sm">
                        <div>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="text-foreground">{example.input}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Output: </span>
                          <span className="text-foreground">{example.output}</span>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-muted-foreground">Explanation: </span>
                            <span className="text-foreground">{example.explanation}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Constraints</h3>
                    <p className="text-muted-foreground text-sm font-mono">{problem.constraints}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="visualization" className="flex-1 overflow-auto m-0">
              {visualization ? (
                <div className="h-full flex flex-col">
                  {/* Visualizer with Custom Input */}
                  <div className="border-b border-border/50 bg-muted/20 p-4">
                    <DSAVisualizer 
                      visualization={visualization.visualization} 
                      compact 
                      showCustomInput={true}
                    />
                  </div>
                  
                  {/* Scrollable Explanation */}
                  <div className="flex-1 overflow-auto p-4">
                    <ExplanationPanel
                      problemCategory={visualization.problemCategory}
                      simpleExplanation={visualization.simpleExplanation}
                      coreIdea={visualization.coreIdea}
                      stepByStepWalkthrough={visualization.stepByStepWalkthrough}
                      pseudoCode={visualization.pseudoCode}
                      compact
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6">
                  <Sparkles className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click "Visualize" to generate an AI-powered explanation with animated visualization
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={runCode} disabled={isRunning} size="sm">
              {isRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Run
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-background resize-none focus:outline-none min-h-[300px]"
              spellCheck={false}
            />

            {/* Output */}
            <div className="border-t border-border/50">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/30">
                Output
              </div>
              <pre className="p-4 font-mono text-sm min-h-[100px] max-h-[200px] overflow-auto bg-background">
                {output || 'Run your code to see output...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
