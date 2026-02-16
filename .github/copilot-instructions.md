# Copilot Instructions for OUROZ

## Architecture Overview
- **Frontend:** React + TypeScript, organized in `components/`, `src/components/`, and `src/pages/`. Major features include B2B, B2C, AI, Admin, and Category modules.
- **Backend:** Node.js/Express in `server/` with API routes, middleware, and DB migrations. Suppliers API is a key integration point.
- **Data Flow:** Supplier data flows from `server/api/suppliers` to frontend via hooks like `useSupplier.ts`.
- **Design System:** Shared UI components and styles in `src/components/ui/` and `src/styles/design-system.css`.

## Developer Workflows
- **Build:** Use Vite (`vite.config.ts`). Run `npm run build` for production builds.
- **Dev Server:** Start with `npm run dev` (Vite for frontend, custom scripts for backend if needed).
- **Backend:** Run `node server/index.ts` or use `ts-node` for development.
- **Migrations:** SQL files in `server/db/migrations/`. Apply manually or via scripts.

## Project Conventions
- **TypeScript:** Strict typing enforced. Types in `types.ts`, `src/types/`, and `server/api/suppliers/schemas.ts`.
- **Component Structure:** Prefer functional components. Group related files (cards, sections) under feature folders.
- **API Routes:** Backend routes in `server/routes/` and `server/api/`. Frontend API configs in `src/config/api.routes.ts`.
- **Error Handling:** Use `src/components/ui/ErrorState.tsx` and `server/utils/errors.ts`.
- **Loading States:** Use `src/components/ui/LoadingState.tsx`.

## Integration & Communication
- **AI Integration:** `components/AI/` and `services/geminiService.ts` for AI features.
- **Supplier Data:** Managed via hooks (`src/hooks/useSupplier.ts`) and profile components.
- **Navigation:** Centralized in `components/Navigation.tsx`.

## Examples
- To add a new supplier card: create in `src/components/supplier/cards/`, update `SupplierTabs.tsx`.
- To add a backend API: add route in `server/api/suppliers/routes.ts`, controller logic in `controller.ts`, schema in `schemas.ts`.

## Key Files & Directories
- `App.tsx`, `index.tsx`: Entry points
- `components/`, `src/components/`: UI logic
- `server/`: Backend logic
- `src/hooks/`: Custom hooks
- `src/types/`: Type definitions
- `server/db/migrations/`: Database schema

---

> Update this file as architecture or conventions evolve. For unclear patterns, check feature folders or ask for clarification.
