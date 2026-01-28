
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isDiscImage: { 
      type: Type.BOOLEAN, 
      description: "判断上传的图片是否为 DISC 测评结果（包含 D, I, S, C 分数或图表）。如果是，返回 true；否则返回 false。" 
    },
    overallTitle: { type: Type.STRING, description: "性格类型的标题。如果 isDiscImage 为 false，请留空。" },
    summary: { type: Type.STRING, description: "深度解读总结。如果 isDiscImage 为 false，请留空。" },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "典型特质列表。如果 isDiscImage 为 false，返回空数组。"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "核心优势列表。如果 isDiscImage 为 false，返回空数组。"
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "成长机会列表。如果 isDiscImage 为 false，返回空数组。"
    },
    interpersonalAdvice: { type: Type.STRING, description: "人际建议。如果 isDiscImage 为 false，请留空。" },
    careerAdvice: { type: Type.STRING, description: "职业建议。如果 isDiscImage 为 false，请留空。" }
  },
  required: ["isDiscImage", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzeDiscImage = async (base64Image: string): Promise<any> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `你是一位资深的心理学专家和 DISC 测评顾问。
            
            你的首要任务是核实上传的图片是否包含 DISC 性格测评的结果（通常包含 D, I, S, C 四个维度的分数、百分比或柱状图/折线图）。
            
            1. 如果图片内容与 DISC 测评结果无关，请将 isDiscImage 设为 false，并且不要进行任何性格分析。
            2. 如果是 DISC 结果，请识别 D, I, S, C 的具体数值，并根据这些数值提供深度的、专业的人格解读。
            3. 请以温暖、洞察力强的中文撰写报告。
            
            输出必须严格符合提供的 JSON 格式。`
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
      temperature: 0.2,
    }
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
};
