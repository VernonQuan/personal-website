# Personal Website

A modern, professionally-designed personal website built with React, TypeScript, and Vite. Includes an AI-powered resume Q&A chatbot powered by OpenAI.

## Features

- **Fast development experience** with Vite and TypeScript
- **Responsive, accessible design** with Tailwind CSS
- **Dark/light theme toggle** with localStorage persistence
- **AI-powered chatbot** that answers questions about your resume
- **Production-ready** with ESLint, Prettier, and pre-commit hooks
- **GitHub Actions CI/CD** for automated testing and builds
- **Code splitting** with lazy-loaded pages for optimal performance

## Quick Start

### Prerequisites

- Node.js >= 20.19.0 (or >= 22.12.0)
- npm or yarn

### Installation

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file in the project root with your configuration:
   ```sh
   OPENAI_API_KEY=your_openai_api_key
   CHAT_API_KEY=your_optional_api_key
   OPENAI_MODEL=gpt-4o-mini
   PORT=8787
   RESUME_PATH=./server/resume.md
   CORS_ORIGIN=http://localhost:5173
   VITE_CHAT_API_URL=http://localhost:8787/api/chat
   ```

### Development

**Frontend only:**
```sh
npm start
```

**Backend (Express server with OpenAI integration):**
```sh
npm run server
```

**Frontend + Backend together:**
```sh
npm run dev:all
```

### Production

Build for production:
```sh
npm run build
npm run preview  # preview locally
```

## Architecture

### Frontend (`src/`)

- **Pages**: Home, About, Projects, Contact, Resume
- **Components**: Reusable UI components with co-located styles
- **Routing**: React Router with nested routes and lazy loading
- **Theming**: CSS variables with dark/light mode support

### Backend (`server/`)

- **Express server** that acts as a relay to OpenAI
- **Context injection** from resume.md for relevant responses
- **CORS support** for cross-origin requests
- **API key validation** for optional authentication

## Key Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Start Vite dev server |
| `npm run server` | Start Express backend |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Configuration

### Environment Variables

**Backend:**
- `OPENAI_API_KEY` — OpenAI API key (required)
- `CHAT_API_KEY` — Optional API key for the client in `x-api-key` header
- `OPENAI_MODEL` — OpenAI model (default: `gpt-4o-mini`)
- `PORT` — Server port (default: `8787`)
- `RESUME_PATH` — Path to resume context file
- `CORS_ORIGIN` — Allowed origin(s) for CORS

**Frontend:**
- `VITE_CHAT_API_URL` — Chat API endpoint (default: `http://localhost:8787/api/chat`)
- `VITE_CHAT_API_KEY` — Optional API key (must match `CHAT_API_KEY`)

### Resume Context

Update [server/resume.md](server/resume.md) with your resume content. This is used as context for the AI chatbot to provide relevant responses.

## Development

### Code Quality

- **Linting & Formatting**: ESLint + Prettier
- **Pre-commit hooks**: Husky + lint-staged (auto-fix staged files)
- **CI/CD**: GitHub Actions workflow for testing, linting, and building

To enable pre-commit hooks locally:
```sh
npm run prepare
```

### Project Structure

```
src/
├── App.tsx                 # Routes and app layout
├── components/             # Reusable UI components
│   ├── PageFrame/         # Header/footer layout
│   ├── About/
│   ├── Resume/
│   ├── Contact/
│   ├── Chatbox/           # AI chat interface
│   └── ...
├── pages/                 # Page components (lazy-loaded)
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── styles.css             # Global styles & theme variables

server/
├── index.ts               # Express server and OpenAI relay
├── resume.md              # Your resume (used as AI context)
└── tsconfig.json
```

### Import Aliases

- `@/` → `src/`
- `components/` → `src/components/`
- `pages/` → `src/pages/`
- `hooks/` → `src/hooks/`
- `utils/` → `src/utils/`

Example: `import { useTheme } from '@/hooks/useTheme'`

## Deployment

### Frontend

- **Static hosting** (GitHub Pages, Vercel, Netlify): Run `npm run build` and deploy `dist/`
- **Vercel/Netlify**: Connect GitHub repo and set build command to `npm run build`

### Backend

- **Node.js hosting** (Railway, Heroku, AWS): Deploy the server alongside the frontend or separately
- Ensure `OPENAI_API_KEY` and other env vars are set in your hosting environment

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Requires ES2020+ support.

## License

MIT
