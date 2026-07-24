import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataStructure, operation, value, currentState, details } =
      await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found");
    }

    let prompt = "";

    if (dataStructure === "stack") {
      prompt = `Explain in simple terms: A stack (LIFO) operation where we ${operation} the value "${value}". Current stack: [${currentState}]. Keep it under 3 sentences.`;
    } else if (dataStructure === "queue") {
      prompt = `Explain in simple terms: A queue (FIFO) operation where we ${operation} the value "${value}". Current queue: [${currentState}]. Keep it under 3 sentences.`;
    } else if (dataStructure === "sorting") {
      prompt = `Explain why we swapped elements at positions ${details.index1} and ${details.index2} (values ${details.value1} and ${details.value2}) in bubble sort. Keep it under 2 sentences.`;
    } else {
      prompt = "Explain this DSA operation in simple beginner-friendly language.";
    }

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                "You are an expert Data Structures and Algorithms tutor.\n\n" +
                prompt,
            },
          ],
        },
      ],
    }),
  }
);

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error(result.error?.message || "Gemini API Error");
    }

    const explanation =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation generated.";

    return new Response(
      JSON.stringify({
        explanation,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown Error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});