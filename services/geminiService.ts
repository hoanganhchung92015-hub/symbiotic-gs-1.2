
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

/**
 * Generates study content using Gemini API based on subject and prompt.
 * Optimized for speed using gemini-3-flash-preview.
 */
export const generateStudyContent = async (
  subject: string,
  prompt: string,
  image?: string // Base64 encoded string
): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    Bạn là Symbiotic AI Pro - AI Trợ lý Giáo dục Đa năng tốc độ cao cho học sinh Việt Nam.
    Nhiệm vụ: Phân tích nội dung môn ${subject} và cung cấp phản hồi JSON chính xác tuyệt đối về mặt khoa học.
    
    YÊU CẦU NGHIÊM NGẶT VỀ ĐỊNH DẠNG & KHOA HỌC:
    1. TUYỆT ĐỐI KHÔNG sử dụng dấu sao (*) trong bất kỳ trường hợp nào. 
    2. Sử dụng xuống dòng và khoảng trắng để phân cấp thông tin. Trình bày sạch sẽ, khoa học.
    3. Các công thức toán học, hóa học, ký hiệu vật lý phải tuân thủ quy chuẩn SGK Việt Nam.
    4. Trình bày các bước giải logic, mạch lạc.
    
    Cấu trúc JSON yêu cầu:
    {
      "speed": {
        "answer": "Ghi đáp án đúng ngắn gọn nhất. Không giải thích.",
        "similar": {
          "question": "Một câu hỏi trắc nghiệm tương tự cùng dạng bài.",
          "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
          "correctIndex": 0
        }
      },
      "socratic": "Gợi ý 2-3 bước tư duy then chốt dưới dạng câu hỏi. Không giải hộ.",
      "notebooklm": "Hệ thống hóa lý thuyết cốt lõi bằng các đoạn văn ngắn. Xuống dòng giữa các ý.",
      "perplexity": "Kiến thức mở rộng, ứng dụng thực tiễn hoặc các liên hệ thực tế sâu sắc.",
      "tools": "Hướng dẫn bấm máy tính Casio 580 VNX cực kỳ chi tiết từng phím. Nếu không phải Toán, trích dẫn quy định pháp luật hoặc sự kiện lịch sử chính xác.",
      "mermaid": "Mã Mermaid Mindmap hệ thống hóa toàn bộ kiến thức của câu hỏi. CẤU TRÚC BẮT BUỘC: mindmap\\n  root((Tên chủ đề))\\n    Ý chính 1\\n      Ý phụ 1.1\\n      Ý phụ 1.2\\n    Ý chính 2\\n      Ý phụ 2.1\\n    Ý chính 3. Lưu ý: Không dùng dấu ngoặc đơn hoặc ký tự đặc biệt trong các node ý phụ để tránh lỗi render."
    }
  `;

  const parts: any[] = [{ text: prompt }];
  if (image) {
    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          speed: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              similar: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER }
                },
                required: ["question", "options", "correctIndex"]
              }
            },
            required: ["answer", "similar"]
          },
          socratic: { type: Type.STRING },
          notebooklm: { type: Type.STRING },
          perplexity: { type: Type.STRING },
          tools: { type: Type.STRING },
          mermaid: { type: Type.STRING }
        },
        required: ["speed", "socratic", "notebooklm", "perplexity", "tools", "mermaid"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text.trim()) as AIResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Lỗi xử lý dữ liệu từ AI.");
  }
};
