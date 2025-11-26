import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AI_TECHNIQUE, AnalysisResult } from '../types';

// Ensure API Key exists
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The identified name of the main food item." },
    portionEstimate: { type: Type.STRING, description: "Estimated portion size (e.g., '1 cup', '200g')." },
    macros: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER, description: "Total calories." },
        protein: { type: Type.NUMBER, description: "Protein in grams." },
        carbs: { type: Type.NUMBER, description: "Carbohydrates in grams." },
        fat: { type: Type.NUMBER, description: "Total fat in grams." },
      },
      required: ["calories", "protein", "carbs", "fat"],
    },
    confidenceScore: { type: Type.NUMBER, description: "Confidence score from 0 to 100." },
    reasoning: { type: Type.STRING, description: "Brief explanation of how the estimate was derived." },
  },
  required: ["foodName", "portionEstimate", "macros", "confidenceScore", "reasoning"],
};

export const analyzeImageWithGemini = async (
  base64Image: string,
  technique: AI_TECHNIQUE
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const startTime = performance.now();
  const mimeType = "image/png"; // Assuming generic PNG for base64 passed, simplistic handling for demo

  let systemInstruction = "";

  // Prompt Engineering based on Technique
  switch (technique) {
    case AI_TECHNIQUE.RAPID_SCAN:
      systemInstruction = `
        You are a fast food-scanning AI. 
        Identify the food in the image immediately and provide a standard nutritional estimate based on common serving sizes.
        Do not overthink ingredients. Focus on the most likely standard dish.
        Return raw estimates.
      `;
      break;
    case AI_TECHNIQUE.DEEP_ANALYSIS:
      systemInstruction = `
        You are an advanced nutritional researcher.
        Perform a deep breakdown of the image. Analyze:
        1. Visible ingredients and their ratios.
        2. Cooking methods (fried, grilled, steamed) and their impact on oil content.
        3. Density and volume estimation relative to standard plate sizes.
        Use a Chain-of-Thought process before outputting the final JSON. 
        Be precise and account for hidden fats or sugars.
      `;
      break;
    case AI_TECHNIQUE.HEALTH_OPTIMIZED:
      systemInstruction = `
        You are a strict clinical dietitian.
        Analyze this food for a patient with dietary restrictions. 
        Tend to overestimate calories and fats slightly to be safe (conservative estimate).
        Focus on the nutritional quality.
        Be critical about portion sizes.
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image.split(',')[1], // Remove data URL prefix
            },
          },
          {
            text: "Analyze this food image according to your system instructions.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent data
      },
    });

    const endTime = performance.now();
    const processingTimeMs = Math.round(endTime - startTime);

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    const parsedData = JSON.parse(jsonText);

    return {
      ...parsedData,
      processingTimeMs,
    };

  } catch (error) {
    console.error(`Error in technique ${technique}:`, error);
    throw error;
  }
};
