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
    const { messages, language = "en" } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful agricultural assistant chatbot for Indian farmers.

You provide information about:
- Farming techniques and best practices
- Government schemes and subsidies for farmers
- Weather and crop planning advice
- Market prices and agricultural news
- Pest control and crop diseases

Keep responses concise, practical, and farmer-friendly.

Current language context: ${language}

If the user asks in Hindi, Tamil, Telugu, Kannada, or Marathi, respond in that language using simple, friendly language that farmers can understand.`;

    const contents = (messages || [])
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
          {
            text:
              typeof msg.content === "string"
                ? msg.content
                : String(msg.content ?? ""),
          },
        ],
      }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          contents,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Gemini API error:", response.status, errorText);

      return new Response(
        JSON.stringify({
          error: "Unable to get a response from Gemini.",
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();

    const aiMessage =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    return new Response(
      JSON.stringify({
        message: aiMessage,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in chat function:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
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