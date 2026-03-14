import path from 'path';
import fs from 'fs';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);

const isProduction = process.env.NODE_ENV === 'production';

const allSiteDestinations = [
  {
    path: '/',
    label: 'Home',
    description: 'Landing page with the site introduction and a primary contact call to action.',
  },
  {
    path: '/about',
    label: 'About',
    description: 'Professional summary, background, and general information about Vernon.',
  },
  {
    path: '/resume',
    label: 'Resume',
    description: 'Resume details, experience, and qualifications.',
  },
  {
    path: '/projects',
    label: 'Projects',
    description: 'Project list and project detail pages.',
  },
  {
    path: '/contact',
    label: 'Contact',
    description: 'Contact information and ways to get in touch.',
  },
] as const;

const siteDestinations = allSiteDestinations.filter(
  ({ path: targetPath }) => targetPath !== '/projects' || !isProduction
);

const allowedNavigationTargets = new Set<string>(
  siteDestinations.map(({ path: targetPath }) => targetPath)
);

const chatResponseSchema = {
  name: 'chat_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['message', 'actions'],
    properties: {
      message: {
        type: 'string',
      },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['type', 'target', 'label', 'requiresConfirmation', 'reason'],
          properties: {
            type: {
              type: 'string',
              enum: ['navigate'],
            },
            target: {
              type: 'string',
              enum: siteDestinations.map(({ path: targetPath }) => targetPath),
            },
            label: {
              type: 'string',
            },
            requiresConfirmation: {
              type: 'boolean',
            },
            reason: {
              type: 'string',
            },
          },
        },
      },
    },
  },
} as const;

const workspaceRoot = process.cwd();
const resumePath = process.env.RESUME_PATH
  ? path.resolve(workspaceRoot, process.env.RESUME_PATH)
  : path.join(workspaceRoot, 'server', 'resume.md');
let resumeText = '';
try {
  resumeText = fs.readFileSync(resumePath, 'utf8');
} catch {
  console.warn(`Resume file not found at ${resumePath}.`);
}

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin: string) => origin.trim());
app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: '1mb' }));

const buildSystemPrompt = (currentPath?: string) => {
  const destinationsSummary = siteDestinations
    .map(({ path: targetPath, label, description }) => `- ${label} (${targetPath}): ${description}`)
    .join('\n');

  return [
    "You are a helpful assistant for questions about Vernon Quan's professional history, projects, and resume.",
    "Only answer using the resume content provided. If the answer is not in the resume, say you do not know but don't reference it's not in the resume.",
    'Be concise, factual, and avoid guessing or inventing details.',
    'If asked for definitions or explanations of technical terms, provide brief answers without going into unnecessary detail.',
    'Try to keep the response brief and to the point, ideally under 50 words.',
    'When sharing any URL or link, always write the full URL starting with https://. Never place a period, comma, or any other punctuation character directly after a URL.',
    'You can also help users find content on the website using the available destinations listed below.',
    'Return a valid JSON object with the exact shape {"message":"string","actions":[]} and no surrounding markdown.',
    'If the user asks where to find something on the site, answer briefly, recommend the best destination, and end the message with exactly: "Would you like me to lead you there?"',
    'If the user explicitly asks you to take, lead, navigate, bring, or send them to a page, return a navigate action with requiresConfirmation set to false and a short confirmation message.',
    'When you recommend a destination without navigating yet, return a navigate action with requiresConfirmation set to true.',
    'If no action is needed, return an empty actions array.',
    'If the user asks about a destination that is not listed in AVAILABLE DESTINATIONS, say you cannot help with that on the site right now and do not mention hidden or unavailable pages.',
    'Only use the destination paths provided below. Never invent routes or actions.',
    'Assume the user asking you questions is not Vernon Quan.',
    '',
    'AVAILABLE DESTINATIONS:',
    destinationsSummary,
    '',
    `CURRENT PAGE: ${currentPath || '/'}`,
    '',
    'RESUME CONTENT:',
    resumeText || '(No resume content found.)',
  ].join('\n');
};

type HistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatAction = {
  type: 'navigate';
  target: string;
  label: string;
  requiresConfirmation: boolean;
  reason: string;
};

type ChatResponsePayload = {
  message: string;
  actions: ChatAction[];
};

type ChatRequestBody = {
  message?: string;
  history?: HistoryItem[];
  currentPath?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeChatAction = (value: unknown): ChatAction | null => {
  if (!isRecord(value)) {
    return null;
  }

  const type = value.type;
  const target = value.target;
  const label = value.label;
  const requiresConfirmation = value.requiresConfirmation;
  const reason = value.reason;

  if (
    type !== 'navigate' ||
    typeof target !== 'string' ||
    !allowedNavigationTargets.has(target) ||
    typeof label !== 'string' ||
    typeof requiresConfirmation !== 'boolean' ||
    typeof reason !== 'string'
  ) {
    return null;
  }

  return {
    type,
    target,
    label: label.trim() || 'Destination',
    requiresConfirmation,
    reason: reason.trim(),
  };
};

const normalizeChatResponse = (value: unknown): ChatResponsePayload => {
  if (!isRecord(value)) {
    return {
      message: 'Sorry, I do not have a response right now.',
      actions: [],
    };
  }

  const message = typeof value.message === 'string' ? value.message.trim() : '';
  const actions = Array.isArray(value.actions)
    ? value.actions
        .map(normalizeChatAction)
        .filter((action): action is ChatAction => action !== null)
    : [];

  return {
    message: message || 'Sorry, I do not have a response right now.',
    actions,
  };
};

const buildInputMessages = (message: string, history?: HistoryItem[], currentPath?: string) => {
  const systemPrompt = buildSystemPrompt(currentPath);
  const input: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content: systemPrompt,
    },
  ];

  if (Array.isArray(history)) {
    history
      .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
      .slice(-8)
      .forEach((item) => {
        input.push({
          role: item.role,
          content: String(item.content || ''),
        });
      });
  }

  input.push({
    role: 'user',
    content: message,
  });

  return input;
};

const requestStructuredChatResponse = async (
  apiKey: string,
  message: string,
  history?: HistoryItem[],
  currentPath?: string
) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: buildInputMessages(message, history, currentPath),
      temperature: 0.2,
      max_tokens: 400,
      response_format: {
        type: 'json_schema',
        json_schema: chatResponseSchema,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed.');
  }

  const rawContent = data?.choices?.[0]?.message?.content;
  if (typeof rawContent === 'string') {
    try {
      return normalizeChatResponse(JSON.parse(rawContent));
    } catch {
      return normalizeChatResponse({ message: rawContent, actions: [] });
    }
  }

  return normalizeChatResponse(rawContent);
};

app.post('/api/chat', async (req: Request<unknown, unknown, ChatRequestBody>, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY on the server.' });
  }

  const expectedKey = process.env.CHAT_API_KEY;
  if (expectedKey && req.header('x-api-key') !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const message = String(req.body?.message || '').trim();
  const history = req.body?.history;
  const currentPath = typeof req.body?.currentPath === 'string' ? req.body.currentPath : '/';
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const chatResponse = await requestStructuredChatResponse(apiKey, message, history, currentPath);
    return res.json(chatResponse);
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unexpected error.';
    return res.status(500).json({ error: messageText });
  }
});

app.post(
  '/api/chat/stream',
  async (req: Request<unknown, unknown, ChatRequestBody>, res: Response) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY on the server.' });
    }

    const expectedKey = process.env.CHAT_API_KEY;
    if (expectedKey && req.header('x-api-key') !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const message = String(req.body?.message || '').trim();
    const history = req.body?.history;
    const currentPath = typeof req.body?.currentPath === 'string' ? req.body.currentPath : '/';
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Set SSE response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const chatResponse = await requestStructuredChatResponse(
        apiKey,
        message,
        history,
        currentPath
      );

      for (const char of chatResponse.message) {
        res.write(`data: ${JSON.stringify({ type: 'content', content: char })}\n\n`);
      }

      if (chatResponse.actions.length > 0) {
        res.write(
          `data: ${JSON.stringify({ type: 'actions', actions: chatResponse.actions })}\n\n`
        );
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Unexpected error.';
      res.write(`data: ${JSON.stringify({ error: messageText })}\n\n`);
      res.end();
    }
  }
);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Chat backend listening on http://localhost:${port}`);
});
