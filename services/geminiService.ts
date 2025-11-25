import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { Lead } from '../types';

// We do not initialize the client globally to allow dynamic API key injection
// The client will be created inside the functions.

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Adarsh Realtor". 
Your goal is to politely and professionally converse with potential real estate clients on Instagram.
You must collect the following information naturally:
1. Name
2. Phone Number
3. Property Requirement (e.g., Buying/Renting, Budget, Location, BHK)

Tone: Professional, Warm, Helpful. You can use Hinglish (Hindi + English) if the user speaks it.
Constraints: Keep messages short (under 50 words) like a text message.
Do not ask for all details at once. Ask one question at a time.
Once you have the Name, Phone, and Requirement, politely thank them and say a team member will call them shortly.
`;

export const createChatSession = (apiKey: string) => {
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const extractLeadData = async (apiKey: string, chatHistory: string): Promise<Partial<Lead> | null> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const extractionPrompt = `
    Analyze the following chat history between Adarsh Realtor Bot and a User.
    Extract the User's Name, Phone Number, and Property Requirement.
    If a piece of information is missing, return null for that field.
    
    Chat History:
    ${chatHistory}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: extractionPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            phone: { type: Type.STRING, nullable: true },
            requirement: { type: Type.STRING, nullable: true },
            isComplete: { type: Type.BOOLEAN, description: "True if all 3 fields are present" }
          },
          required: ["isComplete"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error extracting lead data:", error);
    return null;
  }
};
