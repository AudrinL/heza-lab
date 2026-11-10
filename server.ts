import 'dotenv/config';

import { GoogleGenAI } from '@google/genai';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface AssistantContext {
  appRoute?: string;
  userRole?: string;
  experiment?: {
    title?: string;
    subject?: string;
    gradeLevel?: string;
    curriculumRef?: string;
    summary?: string;
    learningObjectives?: string[];
    equipmentList?: string[];
    instructions?: string[];
  };
}

interface AssistantRequest {
  messages?: ChatMessage[];
  context?: AssistantContext;
}

const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as ChatMessage;
  return (
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0 &&
    message.content.length <= 2_000
  );
}

function compactContext(context: AssistantContext | undefined): string {
  if (!context) return 'No specific lesson context is currently available.';

  const experiment = context.experiment;
  const lines = [
    `Current app area: ${context.appRoute ?? 'unknown'}`,
    `User perspective: ${context.userRole ?? 'student'}`
  ];

  if (experiment?.title) {
    lines.push(
      `Experiment: ${experiment.title}`,
      `Subject and level: ${experiment.subject ?? 'science'}, ${experiment.gradeLevel ?? 'unspecified'}`,
      `Curriculum reference: ${experiment.curriculumRef ?? 'unspecified'}`,
      `Summary: ${experiment.summary ?? 'unavailable'}`,
      `Learning objectives: ${(experiment.learningObjectives ?? []).slice(0, 6).join('; ')}`,
      `Equipment: ${(experiment.equipmentList ?? []).slice(0, 10).join('; ')}`,
      `Procedure: ${(experiment.instructions ?? []).slice(0, 10).join(' | ')}`
    );
  }

  return lines.join('\n');
}

app.post('/api/assistant', async (req: Request, res: Response) => {
  if (isRateLimited(req.ip || 'unknown')) {
    res.status(429).json({ error: 'Too many questions. Please wait a moment and try again.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.status(503).json({
      error: 'The AI assistant is not configured yet. Add GEMINI_API_KEY to the server environment.'
    });
    return;
  }

  const body = req.body as AssistantRequest;
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

  if (messages.length === 0 || !messages.every(isValidMessage)) {
    res.status(400).json({ error: 'A valid conversation message is required.' });
    return;
  }

  const latestMessage = messages.at(-1);
  if (latestMessage?.role !== 'user') {
    res.status(400).json({ error: 'The latest conversation message must come from the user.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: messages.map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content.trim() }]
      })),
      config: {
        systemInstruction: [
          'You are Heza, HezaLab Africa\'s friendly and accurate science learning assistant.',
          'Teach at the learner\'s stated level using clear, concise language and familiar African classroom examples when useful.',
          'Guide students with questions, hints, and explanations. Do not provide direct answers to active quizzes or assessments.',
          'Prioritize laboratory safety. Never encourage a learner to perform a hazardous real-world procedure without a qualified teacher and proper equipment.',
          'If information is uncertain, say so. Do not invent curriculum requirements, experimental readings, or sources.',
          'Keep most answers below 180 words unless the learner asks for more detail.',
          '',
          'Current HezaLab context:',
          compactContext(body.context)
        ].join('\n'),
        maxOutputTokens: 500,
        temperature: 0.4
      }
    });

    const answer = response.text?.trim();
    if (!answer) {
      res.status(502).json({ error: 'The assistant returned an empty response. Please try again.' });
      return;
    }

    res.json({ message: answer });
  } catch (error) {
    console.error('AI assistant request failed:', error);
    res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again.' });
  }
});

if (isProduction) {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const distDirectory = path.join(currentDirectory, 'dist');
  app.use(express.static(distDirectory));
  app.get('*', (_req, res) => res.sendFile(path.join(distDirectory, 'index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server request failed:', error);
  res.status(500).json({ error: 'The request could not be completed.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`HezaLab is running at http://localhost:${port}`);
});
