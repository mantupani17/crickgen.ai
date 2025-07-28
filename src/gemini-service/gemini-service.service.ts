import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GeminiService {
  private readonly apiKey = this.configService.get<string>("GEMINI_API_KEY");
  
  private readonly endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
  constructor(private readonly configService : ConfigService){}

  

  async generateContent(prompt: string): Promise<string> {
    const response = await axios.post(`${this.endpoint}?key=${this.apiKey}`, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async ask(prompt: string): Promise<any> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
    );
    return response.data
  }

  async askGeminiAI(prompt: string) {
    const ai = new GoogleGenAI({
      apiKey: this.apiKey
    });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });
  }

}
