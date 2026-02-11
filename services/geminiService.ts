
import { GoogleGenAI, Type } from "@google/genai";
// Fixed: Imported missing DataRequest and GeneratedRow from types.ts
import { DataRequest, GeneratedRow } from "../types";

/**
 * Generates structured data using the Gemini 3 Pro model.
 * Uses JSON response mode for reliability as per GenAI coding guidelines.
 */
export const generateStructuredData = async (request: DataRequest): Promise<GeneratedRow[]> => {
  // Always use process.env.API_KEY directly as per guidelines.
  // The SDK must be initialized with an object containing the apiKey.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const rowCount = request.endRange - request.startRange + 1;

  try {
    // Corrected: Directly await ai.models.generateContent with model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
Generate exactly ${rowCount} objects in a JSON array.
Fields: ${request.fields}
Range: ${request.startRange} to ${request.endRange}
Context: ${request.context || "General realistic data"}

Strict Rules:
1. Output ONLY a valid JSON array.
2. Every object must have all fields: ${request.fields}.
3. Data must be realistic, high-quality, and varied.
4. Do NOT truncate. Ensure all ${rowCount} items are included.
      `,
      config: {
        temperature: 0.8,
        topP: 0.95,
        // Using responseMimeType for structured JSON output as recommended.
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });

    // Extracting text output from GenerateContentResponse using the .text property.
    const text = response.text;
    if (!text) {
      throw new Error("The model returned an empty response.");
    }

    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new Error("The engine failed to produce a valid dataset array.");
    }
    return data as GeneratedRow[];
  } catch (error: any) {
    console.error("Gemini Generation error:", error);
    throw new Error(`Data generation failed: ${error.message || "Unknown error"}. Try a smaller range.`);
  }
};
