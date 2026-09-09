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

## Setup

### Install

```bash
npm install

```

### Environment

Create `.env` files using `.env.example` and configure:

```text
DATABASE_URL
OPENAI_API_KEY
OPENAI_MODEL
PORT
VITE_API_URL

```

### Database

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run db:seed

```

The seed loads the catalog products and assigns destination images from `apps/web/public/images`.

### Run Backend

```bash
npm run start:dev

```

Backend:

```text
http://localhost:5000/api/v1

```

### Run Frontend

```bash
npm run dev

```

Frontend:

```text
http://localhost:5173

```

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