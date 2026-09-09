# AI Travel Product Management System

AI-powered travel product management system built with **React, NestJS, PostgreSQL, Prisma, and OpenAI**.

## Features

- Product CRUD
- Product validity and inventory management
- Dashboard statistics
- AI product generation
- AI natural-language product search
- Responsive UI
- Product filtering and pagination

## Tech Stack

- **Frontend:** React, TypeScript, MUI, Vite
- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL, Prisma
- **AI:** OpenAI API

## Architecture

```text
React
  ↓
NestJS REST API
  ↓
Prisma
  ↓
PostgreSQL

NestJS → OpenAI API

```

AI is used to generate product information and interpret natural-language searches. Database access and business rules remain in the backend.

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- Docker Desktop (for PostgreSQL)
- An OpenAI API key

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd travel-product-management
```

### 2. Install dependencies

This is an npm workspaces monorepo. Install everything from the root:

```bash
npm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres 16 with:

| Setting  | Value              |
| -------- | ------------------ |
| Host     | `localhost`        |
| Port     | `5432`             |
| User     | `postgres`         |
| Password | `mysecretpassword` |
| Database | `travel_products`  |

### 4. Configure environment variables

Copy the example env files and fill in your values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

`apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/travel_products?schema=public"
OPENAI_API_KEY="your api key here"
OPENAI_MODEL="gpt-5.6-luna"
PORT=5000
```

`apps/web/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

If you use the Docker Postgres service above, keep `DATABASE_URL` as shown. Replace `OPENAI_API_KEY` with your key.

### 5. Generate the Prisma client, run migrations, and seed

Prisma 7 reads the database URL from `apps/api/prisma7.config.ts`. Run these from `apps/api`:

```bash
cd apps/api
npx prisma generate --config prisma7.config.ts
npx prisma migrate dev --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

The seed loads catalog products and assigns destination images from `apps/web/public/images`.

### 6. Run the apps

From the repository root, start the API and the web app in two terminals:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

| App      | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:5000/api/v1 |

## AI Endpoints

```text
POST /api/v1/ai/products/generate
POST /api/v1/ai/products/search

```

## Product Visibility

A product is available only when:

```text
ACTIVE
+ Valid From <= current time
+ Valid Until >= current time
+ Inventory > 0

```

Expired, inactive, future, and out-of-stock products are excluded from available product results.