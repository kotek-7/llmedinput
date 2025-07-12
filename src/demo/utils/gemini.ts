import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GeminiProvider {
  private genAI: GoogleGenerativeAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || 'gemini-2.5-pro';
    this.temperature = config.temperature || 0.8;
    this.maxTokens = config.maxTokens || 400;
  }

  async getSuggestion(input: string): Promise<string> {
    try {
      if (input.length < 3) {
        return '';
      }

      const model = this.genAI.getGenerativeModel({ model: this.model });

      const prompt = `Complete this text: "${input}"

Continue with only 1 short sentence (maximum 10 words). Don't repeat the input text.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
          candidateCount: 1,
          topP: 0.95,
          topK: 64,
        },
      });

      const response = await result.response;
      
      // Check if content exists and has parts
      let text = '';
      try {
        text = response.text();
      } catch (e) {
        console.log('Failed to get text(), trying manual extraction');
        if (response.candidates && response.candidates[0]?.content?.parts) {
          text = response.candidates[0].content.parts[0]?.text || '';
        }
      }

      // Debug output
      console.log('Gemini API Request:', {
        input,
        prompt,
        model: this.model,
        temperature: this.temperature,
        maxTokens: this.maxTokens,
      });

      console.log('Gemini Full Result:', result);
      console.log('Gemini Response object:', response);
      
      console.log('Gemini API Response:', {
        rawResponse: text,
        responseLength: text.length,
        isEmpty: text.trim() === '',
        candidates: response.candidates,
      });

      // Clean up the response - remove quotes and extra whitespace
      const cleanedText = text.trim().replace(/^["']|["']$/g, '');
      console.log('Cleaned response:', cleanedText);

      return cleanedText;
    } catch (error) {
      console.error('Gemini API error:', error);
      return '';
    }
  }
}

// Helper function to create a Gemini-powered getSuggestion function
export const createGeminiSuggestion = (config: GeminiConfig) => {
  const provider = new GeminiProvider(config);
  return (input: string) => provider.getSuggestion(input);
};
