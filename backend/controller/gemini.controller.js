import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "API key not configured",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};