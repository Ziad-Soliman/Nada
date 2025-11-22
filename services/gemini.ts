import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

// Initialize Gemini
// Note: The API key must be provided in the environment variable API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWordProblemText = async (problem: MathProblem): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const opText = problem.operation === 'add' ? 'addition' : 'subtraction';
    const prompt = `
      Act as a fun math game master for Year 3 students (8 years old).
      Create a SHORT, ONE-SENTENCE space-themed word problem using the numbers ${problem.num1} and ${problem.num2}.
      The operation must be ${opText}.
      Do NOT reveal the answer.
      Examples:
      - "Captain Alex has ${problem.num1} stars and finds ${problem.num2} more, how many in total?"
      - "The rocket had ${problem.num1} liters of fuel and used ${problem.num2} liters, how much is left?"
      Return ONLY the sentence.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation failed, falling back to template", error);
    // Fallback templates
    if (problem.operation === 'add') {
      return `A space rover collected ${problem.num1} moon rocks and then found ${problem.num2} more. How many rocks does it have now?`;
    } else {
      return `The alien spaceship had ${problem.num1} batteries, but ${problem.num2} fell out. How many batteries are left?`;
    }
  }
};
