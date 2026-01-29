
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types.ts";

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isPersonalityTest: { 
      type: Type.BOOLEAN, 
      description: "Whether the image is a personality test result (MBTI, DISC, Enneagram, Big Five, etc.)." 
    },
    testType: { type: Type.STRING, description: "The name of the test system identified." },
    overallTitle: { type: Type.STRING, description: "A creative and precise personality label." },
    summary: { type: Type.STRING, description: "Deep psychological profile (400+ words). Analysis of core motivations and behavioral patterns." },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "8-10 specific behavioral traits with explanations."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-6 core talents or competitive advantages."
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Deep analysis of blind spots and psychological advice for growth."
    },
    interpersonalAdvice: { type: Type.STRING, description: "Customized interpersonal strategy and communication guide." },
    careerAdvice: { type: Type.STRING, description: "Career path strategic advice and long-term development suggestions." }
  },
  required: ["isPersonalityTest", "testType", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzePersonalityImage = async (base64Image: string, lang: Language): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const languagePrompt = lang === 'en' 
    ? "Respond in English. Provide detailed, sophisticated, and professional psychological analysis." 
    : "使用中文回答。提供详细、深刻且专业的心理学分析。拒绝平庸套话。";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `You are a world-renowned psychologist and career coach expert in MBTI, DISC, Enneagram, Big Five, etc.
            
            Task: Deeply analyze the uploaded personality test screenshot.
            Requirements:
            1. Identify the specific test system.
            2. Provide a deep, empathetic, and insightful profile.
            3. ${languagePrompt}
            4. If the image is not a recognized test, set isPersonalityTest to false.`
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1]
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: REPORT_SCHEMA,
      temperature: 0.75
    }
  });

  if (!response.text) {
    throw new Error("AI Analysis Failed");
  }

  return JSON.parse(response.text.trim());
};
