
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isDiscImage: { 
      type: Type.BOOLEAN, 
      description: "严格判断图片是否为 DISC 测评结果。如果图片完全不包含 D/I/S/C 分数、图表或相关性格描述，必须返回 false。" 
    },
    overallTitle: { type: Type.STRING, description: "一个富有启发性的性格标签（如：深思熟虑的战略执行官）。" },
    summary: { type: Type.STRING, description: "长篇幅（不少于 350 字）的深度性格画像。需要分析个体的核心动机、压力下的反应以及内在心理能量的流动方向。" },
    traits: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "8 项具体的行为特质。每项不仅描述表现，还要分析这种表现对周围人的影响（正面与潜在摩擦点）。"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "基于 DISC 组合的独特优势，举例说明在什么具体场景下这种优势会爆发式显现。"
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "深刻的自我局限分析。提供基于认知行为疗法（CBT）视角的改进建议。"
    },
    interpersonalAdvice: { type: Type.STRING, description: "针对性极强的人际攻略：如何与激进者相处、如何赢得保守者的信任、如何在社交中节省能量等。" },
    careerAdvice: { type: Type.STRING, description: "职业生涯中长期的战略规划。包括最能激发其潜能的管理风格、建议避开的职场文化类型，以及未来的转型方向。" }
  },
  required: ["isDiscImage", "overallTitle", "summary", "traits", "strengths", "growthAreas", "interpersonalAdvice", "careerAdvice"]
};

export const analyzeDiscImage = async (base64Image: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          {
            text: `你是一位顶级企业教练和心理学家。
            
            任务：
            深度解析这张 DISC 测评截图。你的目标是让用户看后产生“你比我更懂我”的共鸣。
            
            分析准则：
            1. **拒绝平庸**：不要输出显而易见的废话（如“你很勤奋”）。请分析：因为你倾向于追求极致的逻辑闭环（高C），所以在面对模糊决策时会产生生理性焦虑。
            2. **多维交叉**：如果 D 和 I 都很高，分析其“外放能量”与“结果导向”如何博弈。
            3. **严格过滤**：如果图片中没有明显的 DISC 数据（百分比、条形图、饼图或 D/I/S/C 字样），请将 isDiscImage 设为 false。
            4. **内容厚度**：分析必须充实、具体、具有洞察力。
            
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
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return JSON.parse(response.text || '{}');
};
