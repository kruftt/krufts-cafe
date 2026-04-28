# CLAUDE.md - krufts.cafe

## Tech Stack
Tools:
- bun
- vite

Server:
- react router v7
- postgres
- zod
- prisma
- kysely
- trpc
- better-auth
  
Client:
- react
- jotai
- tailwindcss
- shadcn
- lucide


## Structure
- app/ - application code
- app/components/ - react components
- app/components/ui - shadcn base components (unedited)
- app/lib - library-like modules
- app/routes - file-based routes
- app/services - service modules / functions
- app/state - contains the database schema and client for prisma, zod models for the database, jotai atoms for the frontend, and tRPC configuration
- app/utils - utility functions
- public - publicly hosted files


## Instructions
- I am using bun, so prefer bun commands. Also, remember that when running prisma commands/migrations we must include the --bun flag, e.g. `bunx --bun prisma generate`

