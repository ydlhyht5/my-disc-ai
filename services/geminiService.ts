
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isDiscImage: { 
      type: Type.BOOLEAN, 
      description: "判断上传的图片是否为 DISC 测评结果。如果是返回 true；否则返回 false。" 
    },
    overallTitle: { type: Type.STRING, description: "富有文学感或专业感的性格类型标题（例如：锐意进取的开拓者）。" },
    summary: { type: Type.STRING, description: "多维度、深度的性格总述，需包含内在动力分析。" },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "至少 6-8 项细致的人格特质描述，每项需解释其背后的心理动因。"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "核心竞争优势，需结合职场和生活场景具体说明。"
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "深刻的成长痛点与改进方向，需提供可操作的心理学建议。"
    },
    interpersonalAdvice: { type: Type.STRING, description: "详尽的人际沟通指南，包括针对不同性格人群的应对策略。" },
    careerAdvice: { type: Type.STRING, description: "全方位的职业规划建议，包括适合的工作环境、潜在风险和长期发展方向。" }
  },
  required: ["isDiscImage", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzeDiscImage = async (base64Image: string): Promise<any> => {
  // 使用 pro 模型以获得更深刻的洞察力
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          {
            text: `你是一位享誉国际的心理学专家，精通 DISC 行为分析理论及职场心理学。
            
            任务：
            请深度解析这张 DISC 测评结果截图。你的分析不应停留在表面分数，而要穿透数据，勾勒出一个生动、立体的人格画像。
            
            分析要求：
            1. **细致入微**：不要使用通用套话。请根据 D/I/S/C 的比例关系（如高 D 高 C 的矛盾与互补）进行交叉分析。
            2. **内容丰富**：
               - traits 字段：请提供 6 到 8 条深度特质，每条需包含“表现 + 原因”。
               - summary 字段：撰写 300 字左右的深度导语，分析其核心驱动力（是恐惧失败、渴望认可、追求平稳还是坚持真理）。
               - 建议部分：必须包含具体的、立竿见影的行动建议。
            3. **专业语境**：使用专业的心理学词汇，但保持叙述的温度和人文关怀。
            4. **格式核查**：如果图片不是有效的 DISC 报告，必须将 isDiscImage 设为 false。
            
            输出语言：中文。`
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
      temperature: 0.7, // 略微提高随机性以获得更具文学性和多样性的描述
    }
  });

  return JSON.parse(response.text || '{}');
};
