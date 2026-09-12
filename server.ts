import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post('/api/analyze', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
      }

      if (!req.body) {
        return res.status(400).json({ error: 'Invalid request: Body is empty.' });
      }

      const { text, mode } = req.body;
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Valid document text is required.' });
      }

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

      res.json({ result: response.text });
    } catch (error) {
      console.error('Error analyzing document:', error);
      res.status(500).json({ error: 'Failed to analyze document.' });
    }
  });

  app.post('/api/ask', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API key.' });
      }

      if (!req.body) {
        return res.status(400).json({ error: 'Invalid request: Body is empty.' });
      }

      const { text, question, mode } = req.body;
      if (!text || !question) {
        return res.status(400).json({ error: 'Document text and question are required.' });
      }

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

      res.json({ answer: response.text });
    } catch (error) {
      console.error('Error answering question:', error);
      res.status(500).json({ error: 'Failed to answer question.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
