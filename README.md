@"
# Full-stack tech task: task quiz builder.

## Folders
- Backend: NestJS + Prisma + PostgreSQL (Docker)
- Frontend: Next.js (App Router) + TypeScript + Tailwind + React Hook Form + React Query + axios
## Quickstart

### Backend
- cd backend
- yarn install
- docker compose up -d
- yarn prisma generate
- npx prisma migrate dev --name init
- yarn start:dev
# env variables — see backend/.env.example

### Admin
- cd frontend
- npm install
- npm run dev
# env variables — see frontend/.env.example
