
import { GoogleGenAI, Type } from "@google/genai";

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isDiscImage: { 
      type: Type.BOOLEAN, 
      description: "判断图片是否为 DISC 测评结果。包含 D/I/S/C 标签或百分比即为 true。" 
    },
    overallTitle: { type: Type.STRING, description: "一个富有启发性的性格标签（如：睿智的战略家）。" },
    summary: { type: Type.STRING, description: "300字以上的深度性格画像。分析个体的核心动机和心理特质。" },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "8 项具体的行为特质。描述表现及潜在影响。"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "基于 DISC 组合的独特优势。"
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "深刻的自我局限分析与改进建议。"
    },
    interpersonalAdvice: { type: Type.STRING, description: "针对性的人际沟通指南。" },
    careerAdvice: { type: Type.STRING, description: "职业生涯的中长期建议。" }
  },
  required: ["isDiscImage", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzeDiscImage = async (base64Image: string): Promise<any> => {
  // 确保在每次调用时都使用最新的 API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // 切换到响应速度更快的 Flash 模型
    contents: [
      {
        parts: [
          {
            text: `你是一位顶级心理学家。请深度解析这张 DISC 测评截图。
            要求：分析必须具体、有深度，拒绝平庸套话。
            如果图片不是 DISC 相关报告，请将 isDiscImage 设为 false。
            语言：中文。`
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
      temperature: 0.7
    }
  });

  if (!response.text) {
    throw new Error("AI 未能返回有效内容");
  }

  return JSON.parse(response.text.trim());
};
