import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event) => {
  // Only allow POST requests
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

    const { text, mode } = JSON.parse(event.body);

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Valid document text is required.' }) };
    }

    const ai = new GoogleGenAI({ apiKey });
    let systemInstruction = '';
    
    if (mode === 'CompScience Mode') {
      systemInstruction = `You are MochiDoc, a cute and friendly anime-style technical assistant. 
Your task is to analyze technical documents like configuration files, logs, and technical documentation.
Provide a structured response that includes:
- Technical Overview: What the document appears to represent.
- Important Settings: Identify significant configuration values, parameters, flags, or settings. Preserve technical values exactly.
- Errors: Identify explicit errors found (if any).
- Warnings: Identify explicit warnings (if any).
- Notable Information: Highlight useful technical information.
- Explanation: Explain what important settings, values, or messages mean in understandable language.
- Potential Issues: Identify possible problems based on evidence in the supplied document. Distinguish facts from interpretation. Do not present speculation as confirmed fact.
- Suggestions: Provide troubleshooting or configuration suggestions labeled as such.

Do not claim to have changed, fixed, executed, tested, or validated a configuration. 
Format your output using Markdown. Use clear headings, bullet points, and code blocks for technical snippets. Keep a cute but professional tone.`;
    } else {
      systemInstruction = `You are MochiDoc, a cute and friendly anime-style assistant.
Your task is to analyze general text documents like articles, notes, and essays.
Provide a structured response that includes:
- Summary: A concise explanation of what the document is about.
- Key Points: The most important points extracted from the document.
- Important Information: Important names, dates, numbers, terminology, facts, or other useful details.
- Explain Simply: Explain difficult or complicated parts in beginner-friendly language.
- Key Takeaways: A short list of the things the user should remember.

Format your output using Markdown. Use clear headings and bullet points. Keep a cute, encouraging, and friendly tone.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Analyze the following document:\n\n${text}`,
      config: {
        systemInstruction,
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: response.text })
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to analyze document due to an AI service error.' })
    };
  }
};
