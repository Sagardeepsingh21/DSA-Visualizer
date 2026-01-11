import { supabase } from '@/integrations/supabase/client';

export interface ProblemInput {
  problemTitle: string;
  problemStatement: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string;
}

export interface VisualizationResponse {
  problemCategory: string;
  simpleExplanation: string;
  coreIdea: string;
  stepByStepWalkthrough: string[];
  pseudoCode: string;
  visualization: {
    type: string;
    data: any[];
    steps: Array<{
      description: string;
      highlight?: number[];
      pointerPositions?: Record<string, number>;
      extraInfo?: Record<string, any>;
    }>;
  };
}

export const generateVisualization = async (
  problem: ProblemInput
): Promise<VisualizationResponse> => {
  const { data, error } = await supabase.functions.invoke('generate-visualization', {
    body: problem,
  });

  if (error) {
    console.error('Error generating visualization:', error);
    throw new Error('Failed to generate visualization');
  }

  return data as VisualizationResponse;
};
