# Personal Website — React (Vite)

This project is a small React app scaffolded with Vite. It preserves a minimal, accessible design while letting you work in a component-based structure.

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Start the development server (Vite):

```powershell
npm start
```

3. Build for production and preview:

```powershell
npm run build
npm run preview   # preview the production build locally
```

Backend chat relay (resume Q&A)

This repo includes a small Express server that forwards chat messages to OpenAI with your resume context.

1. Copy the example env file and fill in keys:

```powershell
copy .env.example .env
```

2. Update your resume context at server/resume.md.

3. Start the backend in a second terminal:

```powershell
npm run server
```

Single command (frontend + backend)

```powershell
npm run dev:all
```

Environment variables (backend)

- OPENAI_API_KEY: OpenAI API key (required)
- CHAT_API_KEY: optional API key for the client to send in the x-api-key header
- OPENAI_MODEL: defaults to gpt-4.1-mini
- PORT: defaults to 8787
- RESUME_PATH: path to the resume context file
- CORS_ORIGIN: allowed origin(s), comma-separated

Environment variables (frontend)

- VITE_CHAT_API_URL: defaults to http://localhost:8787/api/chat
- VITE_CHAT_API_KEY: optional, must match CHAT_API_KEY

Files to edit (TypeScript)

- `src/App.tsx` — routes and app composition
- `src/components/PageFrame/PageFrame.tsx` — shared header + footer + outlet
- `src/pages/*.tsx` — the page components (Home, About, Projects, Contact)
- `src/styles.css` — app-wide styles (reset, theme variables, layout helpers)
- `src/pages/**/*.css` and `src/components/*.css` — component styles

Import aliases

- Vite resolves `@/` to `src/`, plus `components/`, `pages/`, `hooks/`, and `utils/` for absolute-style imports.
- Example: `import { GithubLink } from 'components/HeaderActions/SocialLinks';` or `import useTheme from '@/hooks/useTheme';`

Linting & formatting

- Run type checks: `npm run typecheck`
- Run lint: `npm run lint`
- Format files with Prettier: `npm run format`

Routing & code splitting

- The site uses React Router with nested routes for `projects` and a 404 `NotFound` page.
- Pages are lazy-loaded using React.lazy (code-splitting) — see `src/App.tsx`.

Theming

- A small theme switcher is available and persists the user's choice in localStorage. See `src/components/HeaderActions/ThemeToggle.tsx` and the PageFrame header where it's wired in.
- Styles are split per component/page using plain CSS files, with app-wide styles living in `src/styles.css`.

Notes

- There are no leftover placeholder files in the project root — styles and script logic live inside `src/` now (see `src/styles.css` and `src/App.tsx`).
- If you want a plain static build to host on GitHub Pages or another static host, `npm run build` writes files to `dist/`.

Replace placeholders (Your Name, email, and content) inside `src/App.tsx` and the files in `src/pages` with your real information.

Pre-commit hooks and CI

- The project uses Husky + lint-staged to run ESLint autofix and Prettier on staged files automatically before commits.
- If you cloned this repo locally, run `npm install` and `npm run prepare` (or `npx husky install`) to activate the git hooks.
- The repo includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs type checks, lint, format checks, and build on push/PR.

VS Code formatting on save

- The workspace recommends and configures Prettier to format on save. Install the recommended extensions (Prettier and ESLint) and the editor will auto-format when saving files.

Node / Vite requirement

- Vite 7.x requires Node.js >= 20.19.0 (or >= 22.12.0). If you see warnings about Node, please upgrade your local Node to 20.19+ or 22+ for the best stability.
