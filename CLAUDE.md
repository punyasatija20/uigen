# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (install deps, generate Prisma client, run DB migrations)
npm run setup

# Development server (Turbopack)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run a single test file
npx vitest run src/lib/transform/__tests__/jsx-transformer.test.ts

# Lint
npm run lint

# Reset database
npm run db:reset
```

Environment: add `ANTHROPIC_API_KEY` to `.env`. Without it, the app runs in mock mode returning static demo responses.

## Architecture

UIGen is a Next.js 15 App Router application where users describe React components in a chat interface, Claude generates them, and they render live in an iframe preview — all without writing files to disk.

### Core Data Flow

```
ChatInterface → POST /api/chat → Claude (with tools) → VirtualFileSystem → PreviewFrame (iframe)
```

1. **Chat** (`/src/lib/contexts/chat-context.tsx`): Manages messages and calls `/api/chat`
2. **API Route** (`/src/app/api/chat/route.ts`): Streams Claude responses using Vercel AI SDK's `streamText()` with two tools: `str_replace_editor` (view/create/edit files) and `file_manager` (delete files). On finish, persists conversation + virtual FS to the DB.
3. **Virtual File System** (`/src/lib/file-system.ts`): In-memory `Map<string, FileNode>` representing files/directories. Never writes to disk.
4. **FileSystemContext** (`/src/lib/contexts/file-system-context.tsx`): Bridges the VFS to React state; selected file drives the code editor.
5. **Preview** (`/src/components/preview/PreviewFrame.tsx`): Transforms JSX via Babel standalone (`/src/lib/transform/jsx-transformer.ts`), creates blob URLs, and renders in an isolated iframe.

### AI Provider Pattern

`/src/lib/provider.ts` returns a real Claude model (`@ai-sdk/anthropic`) when `ANTHROPIC_API_KEY` is set, or a `MockLanguageModel` otherwise. The system prompt lives in `/src/lib/prompts/generation.tsx` and uses Anthropic prompt caching (`providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } }`).

Claude is instructed to always create `/App.jsx` as the root component and use Tailwind CSS for styling.

### Persistence

Prisma + SQLite. Two models:
- `User`: email/password (bcrypt), linked to projects
- `Project`: stores `messages` (JSON) and `data` (serialized VFS JSON) as string fields

Auth uses custom JWT sessions (jose, HS256, 7-day expiry) stored in an httpOnly cookie. `src/middleware.ts` protects `/api/projects` and `/api/filesystem` routes.

### UI Layout

`/src/app/main-content.tsx` is the root layout: resizable panels with chat (35%) on the left and preview/code (65%) on the right. The code panel splits into a file tree (30%) and Monaco editor (70%).

### Path Alias

`@/*` maps to `./src/*` throughout the codebase.
