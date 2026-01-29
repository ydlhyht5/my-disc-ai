
import { GoogleGenAI, Type } from "@google/genai";

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isPersonalityTest: { 
      type: Type.BOOLEAN, 
      description: "判断图片是否为性格测评结果（MBTI、DISC、九型、大五人格、优势分析等）。" 
    },
    testType: { type: Type.STRING, description: "识别出的测试体系名称，如 'MBTI (人格类型指示量表)' 或 '九型人格'。" },
    overallTitle: { type: Type.STRING, description: "一个富有文学感且精准的人格标签（如：深海中的领航员、温和的秩序维护者）。" },
    summary: { type: Type.STRING, description: "不少于 400 字的深度画像。需包含对其核心价值观、内在驱动力及在极端压力下潜在行为模式的深度剖析。" },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "8-10 项具体的行为特质。需解释该特质如何在其日常互动中体现。"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-6 项核心天赋或竞争优势，并说明在何种环境下这些优势能最大化。"
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "深刻的盲点分析。不仅指出问题，还要给出心理学建议。"
    },
    interpersonalAdvice: { type: Type.STRING, description: "定制化的人际策略。包括如何建立深层连接以及如何避免冲突。" },
    careerAdvice: { type: Type.STRING, description: "职业生涯战略方案。包含建议的职场生态位、避坑指南及长期发展建议。" }
  },
  required: ["isPersonalityTest", "testType", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzePersonalityImage = async (base64Image: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `你是一位享誉全球的心理学家和职场教练，精通 MBTI、DISC、九型人格、大五人格、盖洛普优势等所有主流性格测评体系。

任务：
请深度解析用户上传的测评结果截图。

要求：
1. **自动识别**：首先准确辨认图片属于哪种测试体系。
2. **深度洞察**：分析不应停留在表面指标。请利用你的心理学背景，推导出这些数据背后隐藏的人格底色。
3. **语言风格**：专业而不失温度，睿智且充满人文关怀。使用具象化的比喻让用户更容易理解复杂的心理概念。
4. **高质量输出**：summary 部分必须详尽，要让用户感到被深度理解。
5. **异常处理**：如果图片不包含任何明显的测评数据，请将 isPersonalityTest 设为 false，并在其他字段简要说明为何无法解析及建议。

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
      temperature: 0.75
    }
  });

  if (!response.text) {
    throw new Error("AI 未能生成分析报告");
  }

  return JSON.parse(response.text.trim());
};
