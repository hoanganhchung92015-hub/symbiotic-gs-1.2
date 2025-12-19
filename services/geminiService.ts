import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AIResponse } from "../types";

// Vite bắt buộc dùng tiền tố VITE_ để nạp biến môi trường
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateStudyContent = async (
  subject: string,
  prompt: string,
  image?: string 
): Promise<AIResponse> => {
  
  if (!API_KEY) throw new Error("API Key chưa được cấu hình trên Vercel.");

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Sử dụng gemini-1.5-flash để đảm bảo tính ổn định và tốc độ
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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

  const parts: any[] = [{ text: prompt }];
  if (image) {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: base64Data }
    });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      systemInstruction: {
        role: "system",
        parts: [{ text: `Bạn là trợ lý giáo dục Symbiotic AI Pro. Phân tích môn ${subject} và trả về JSON khoa học.` }]
      }
    });

    return JSON.parse(result.response.text()) as AIResponse;
  } catch (error) {
    console.error("Lỗi gọi Gemini API:", error);
    throw new Error("Không thể kết nối với AI. Hãy kiểm tra lại API Key.");
  }
};
