import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion, AnalysisResult, StudyTask } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateQuiz = async (subject: string, language: 'en' | 'am'): Promise<QuizQuestion[]> => {
  const ai = getClient();
  
  // Schema definition for structured output
  const quizSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING } 
        },
        correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
        explanation: { type: Type.STRING }
      },
      required: ["id", "question", "options", "correctAnswer", "explanation"]
    }
  };

  const prompt = `Generate 5 multiple choice questions for Grade 12 ${subject}. 
  The questions should be challenging and relevant to the Ethiopian National Exam curriculum.
  Language: ${language === 'am' ? 'Amharic' : 'English'}.
  If Amharic, ensure the text is correctly encoded.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction: "You are an expert Ethiopian National Exam creator."
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const chatWithTutor = async (history: {role: 'user' | 'model', text: string}[], message: string, language: 'en' | 'am') => {
  const ai = getClient();
  const systemInstruction = `You are EthioLearn AI, a friendly and knowledgeable tutor for Ethiopian students (Grades 1-12).
  You explain concepts clearly, referencing standard Ethiopian textbooks where possible.
  Current Language: ${language === 'am' ? 'Amharic' : 'English'}.
  Keep responses concise but helpful. Use emojis occasionally to be friendly.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      config: { systemInstruction }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const analyzeQuestionText = async (questionText: string, language: 'en' | 'am'): Promise<AnalysisResult | null> => {
  const ai = getClient();

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      source: { type: Type.STRING, description: "e.g. Grade 11 Biology, Unit 3, Page 45" },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard", "National Exam"] },
      successRate: { type: Type.NUMBER, description: "Percentage 0-100" },
      similarQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      topics: { type: Type.ARRAY, items: { type: Type.STRING } },
      explanation: { type: Type.STRING }
    },
    required: ["source", "difficulty", "successRate", "similarQuestions", "topics", "explanation"]
  };

  const prompt = `Analyze this exam question: "${questionText}".
  Provide the likely source from the Ethiopian curriculum, estimate difficulty, simulate a student success rate, and list similar questions.
  Language: ${language === 'am' ? 'Amharic' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis error:", error);
    return null;
  }
};

export const generateStudyPlan = async (goals: string, weakAreas: string[], language: 'en' | 'am'): Promise<StudyTask[]> => {
  const ai = getClient();

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        subjectId: { type: Type.STRING, description: "Use standard ids: math, bio, chem, phys, etc." },
        title: { type: Type.STRING },
        durationMinutes: { type: Type.INTEGER },
        isCompleted: { type: Type.BOOLEAN },
        type: { type: Type.STRING, enum: ["reading", "quiz", "video", "practice"] }
      },
      required: ["id", "subjectId", "title", "durationMinutes", "isCompleted", "type"]
    }
  };

  const prompt = `Create a personalized daily study plan (3-5 tasks) for an Ethiopian student.
  Goal: ${goals}
  Weak Areas: ${weakAreas.join(', ')}
  Language: ${language === 'am' ? 'Amharic' : 'English'}.
  Focus on helping them improve their weak areas while maintaining general progress.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as StudyTask[];
  } catch (error) {
    console.error("Plan generation error:", error);
    return [];
  }
};