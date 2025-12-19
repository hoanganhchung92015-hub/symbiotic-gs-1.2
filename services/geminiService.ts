import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AIResponse } from "./types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateStudyContent = async (
  subject: string,
  prompt: string,
  image?: string 
): Promise<AIResponse> => {
  
  if (!API_KEY) throw new Error("API Key chưa được cấu hình.");

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // SỬA LỖI 400: Dùng v1beta để hỗ trợ JSON Schema tốt nhất
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  }, { apiVersion: 'v1beta' });

  const parts: any[] = [{ text: `Môn học: ${subject}. Yêu cầu: ${prompt}` }];
  
  if (image) {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: base64Data }
    });
  }

  try {
    // Di chuyển generationConfig vào đây để tránh lỗi "Unknown name"
    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: parts 
        }
      ],
      systemInstruction: "Bạn là trợ lý giáo dục Symbiotic AI Pro. Hãy phân tích và trả về dữ liệu JSON theo đúng cấu trúc Schema yêu cầu.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            speed: {
              type: SchemaType.OBJECT,
              properties: {
                answer: { type: SchemaType.STRING },
                similar: {
                  type: SchemaType.OBJECT,
                  properties: {
                    question: { type: SchemaType.STRING },
                    options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    correctIndex: { type: SchemaType.NUMBER }
                  },
                  required: ["question", "options", "correctIndex"]
                }
              },
              required: ["answer", "similar"]
            },
            socratic: { type: SchemaType.STRING },
            notebooklm: { type: SchemaType.STRING },
            perplexity: { type: SchemaType.STRING },
            tools: { type: SchemaType.STRING },
            mermaid: { type: SchemaType.STRING }
          },
          required: ["speed", "socratic", "notebooklm", "perplexity", "tools", "mermaid"]
        }
      }
    });

    const response = await result.response;
    return JSON.parse(response.text()) as AIResponse;

  } catch (error: any) {
    console.error("Lỗi Gemini Service:", error);
    throw new Error("AI không thể phản hồi đúng định dạng. Hãy thử lại.");
  }
};
