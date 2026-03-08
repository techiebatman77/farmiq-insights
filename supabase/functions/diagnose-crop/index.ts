import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: "imageBase64 and mimeType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert agricultural plant pathologist specializing in Kerala, India crops including coconut, rubber, paddy, cardamom, pepper, tea, coffee, banana, arecanut, and tapioca.

Analyze the provided crop/plant image carefully. You must provide a diagnosis ONLY if you can clearly identify a plant disease or pest issue. If the image is not a plant, or you cannot identify any disease, say so honestly.

IMPORTANT: Do NOT hallucinate. If the image is unclear, blurry, or you are not confident, state that clearly.

You MUST respond using the following JSON tool call format. Do not return plain text.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`,
                  },
                },
                {
                  type: "text",
                  text: "Analyze this crop/plant image for diseases or pest issues. Provide your diagnosis.",
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "crop_diagnosis",
                description:
                  "Provide a structured crop disease diagnosis based on the image analysis.",
                parameters: {
                  type: "object",
                  properties: {
                    is_plant: {
                      type: "boolean",
                      description: "Whether the image contains a plant/crop",
                    },
                    disease_detected: {
                      type: "boolean",
                      description: "Whether a disease or pest issue was detected",
                    },
                    confidence: {
                      type: "number",
                      description:
                        "Confidence percentage 0-100. Use lower values if unsure.",
                    },
                    disease_name: {
                      type: "string",
                      description:
                        "Name of the disease or 'Healthy' or 'Unknown' or 'Not a plant'",
                    },
                    crop: {
                      type: "string",
                      description: "Identified crop type",
                    },
                    severity: {
                      type: "string",
                      enum: ["Low", "Medium", "High"],
                      description: "Severity level of the disease",
                    },
                    description: {
                      type: "string",
                      description:
                        "Detailed description of the disease and symptoms observed",
                    },
                    treatment: {
                      type: "string",
                      description:
                        "Specific treatment recommendation with dosage for Kerala conditions",
                    },
                    prevention: {
                      type: "string",
                      description: "Prevention measures",
                    },
                    estimated_cost: {
                      type: "string",
                      description:
                        "Estimated treatment cost in INR (e.g., ₹350 per application/acre)",
                    },
                  },
                  required: [
                    "is_plant",
                    "disease_detected",
                    "confidence",
                    "disease_name",
                    "crop",
                    "severity",
                    "description",
                    "treatment",
                    "prevention",
                    "estimated_cost",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "crop_diagnosis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      // Fallback: try to parse content as text
      const content = data.choices?.[0]?.message?.content || "";
      return new Response(
        JSON.stringify({
          diagnosis: {
            is_plant: false,
            disease_detected: false,
            confidence: 0,
            disease_name: "Analysis Inconclusive",
            crop: "Unknown",
            severity: "Low",
            description: content || "Could not analyze the image. Please try with a clearer photo.",
            treatment: "N/A",
            prevention: "N/A",
            estimated_cost: "N/A",
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose-crop error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
