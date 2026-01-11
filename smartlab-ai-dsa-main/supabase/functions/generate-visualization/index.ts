import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemTitle, problemStatement, examples, constraints } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Simplified, faster prompt
    const prompt = `Analyze this DSA problem and create a simple visualization.

Problem: ${problemTitle}
Statement: ${problemStatement}
Example: ${JSON.stringify(examples[0])}

Return JSON:
{
  "problemCategory": "category name",
  "simpleExplanation": "Simple explanation using real-world analogy (2-3 sentences)",
  "coreIdea": "Key insight in one sentence",
  "stepByStepWalkthrough": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "pseudoCode": "function solve(input) { ... }",
  "visualization": {
    "type": "array",
    "data": [use data from example],
    "steps": [
      {"description": "Step description with emoji", "highlight": [indices], "extraInfo": {"key": "value"}}
    ]
  }
}

Keep it simple and educational. Use emojis in descriptions. 4-6 steps max.`;

    console.log('Generating visualization for:', problemTitle);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite', // Faster model
        messages: [
          {
            role: 'system',
            content: 'You are a DSA educator. Return only valid JSON. Be concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Extract JSON from response
    let jsonResponse;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('Visualization generated successfully');

    return new Response(
      JSON.stringify(jsonResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
