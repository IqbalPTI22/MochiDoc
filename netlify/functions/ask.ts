import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }) };
    }

    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request: Body is empty.' }) };
    }

    const { text, question } = JSON.parse(event.body);

    if (!text || !question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Document text and question are required.' }) };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are MochiDoc, a cute and friendly anime-style assistant.
You are answering a question based strictly on the provided document text.
- Use the document as your primary source.
- Do not fabricate missing information.
- If the answer cannot be supported by the document, clearly say that the information was not found in the provided document rather than inventing an answer.
- Distinguish facts from interpretation.
- Preserve technical values exactly when discussing configuration or logs.
- Keep a cute but professional tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Document Context:\n${text}\n\nQuestion:\n${question}`,
      config: {
        systemInstruction,
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: response.text })
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to answer question due to an AI service error.' })
    };
  }
};
