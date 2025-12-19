import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AIResponse } from "./types"; // Đã sửa lại đường dẫn ./ nếu file này nằm trong thư mục services

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateStudyContent = async (
  subject: string,
  prompt: string,
  image?: string 
): Promise<AIResponse> => {
  
  if (!API_KEY) throw new Error("API Key chưa được cấu hình trên Vercel.");

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // THAY ĐỔI QUAN TRỌNG: Thêm { apiVersion: 'v1' } ở cuối tham số
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
  }, { apiVersion: 'v1' }); // Đảm bảo dùng v1 để hỗ trợ JSON Schema ổn định

  const parts: any[] = [{ text: `Môn học: ${subject}. Nội dung: ${prompt}` }];
  
  if (image) {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    parts.push({
      inlineData: { mimeType: "image/jpeg", data: base64Data }
    });
  }

 try {
    // CÁCH VIẾT MỚI: Truyền thẳng đối tượng chứa nội dung
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: parts 
      }]
      // Lưu ý: Bỏ systemInstruction ở đây nếu bạn đã khai báo nó 
      // lúc khởi tạo model (getGenerativeModel) phía trên.
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as AIResponse;

  } catch (error: any) {
    console.error("Lỗi gọi Gemini API:", error);
    throw new Error("Không thể kết nối với AI. Hãy kiểm tra lại API Key.");
  }
};
