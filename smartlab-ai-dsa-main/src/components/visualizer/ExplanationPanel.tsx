import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, BookOpen, Lightbulb, ListOrdered, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplanationPanelProps {
  problemCategory: string;
  simpleExplanation: string;
  coreIdea: string;
  stepByStepWalkthrough: string[];
  pseudoCode: string;
  compact?: boolean;
}

const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ExplanationPanel = ({
  problemCategory,
  simpleExplanation,
  coreIdea,
  stepByStepWalkthrough,
  pseudoCode,
  compact = false,
}: ExplanationPanelProps) => {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">{problemCategory}</Badge>
        </div>
        
        <CollapsibleSection title="Simple Explanation" icon={BookOpen} defaultOpen={true}>
          <p className="text-muted-foreground leading-relaxed">{simpleExplanation}</p>
        </CollapsibleSection>

        <CollapsibleSection title="Core Idea" icon={Lightbulb}>
          <p className="text-foreground font-medium leading-relaxed">{coreIdea}</p>
        </CollapsibleSection>

        <CollapsibleSection title="Step-by-Step" icon={ListOrdered}>
          <ol className="space-y-2">
            {stepByStepWalkthrough.map((step, index) => (
              <li key={index} className="text-muted-foreground flex gap-2">
                <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CollapsibleSection>

        <CollapsibleSection title="Pseudo Code" icon={Code2}>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs font-mono whitespace-pre-wrap">
            {pseudoCode}
          </pre>
        </CollapsibleSection>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">{problemCategory}</Badge>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Explanation
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{simpleExplanation}</p>
        </div>

        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-primary" />
            Key Insight
          </h4>
          <p className="text-sm text-foreground">{coreIdea}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
            <ListOrdered className="h-4 w-4 text-primary" />
            Approach
          </h4>
          <ol className="space-y-1 text-sm text-muted-foreground">
            {stepByStepWalkthrough.slice(0, 4).map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold text-primary">{index + 1}.</span>
                <span className="line-clamp-2">{step}</span>
              </li>
            ))}
            {stepByStepWalkthrough.length > 4 && (
              <li className="text-xs text-muted-foreground">
                +{stepByStepWalkthrough.length - 4} more steps...
              </li>
            )}
          </ol>
        </div>

        <details className="group">
          <summary className="text-sm font-semibold flex items-center gap-2 cursor-pointer list-none">
            <Code2 className="h-4 w-4 text-primary" />
            Pseudo Code
            <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
          </summary>
          <pre className="mt-2 bg-muted p-3 rounded-md overflow-x-auto text-xs font-mono max-h-[150px] overflow-y-auto">
            {pseudoCode}
          </pre>
        </details>
      </div>
    </div>
  );
};
