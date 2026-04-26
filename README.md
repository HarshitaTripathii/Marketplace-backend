# Marketplace Backend

Scalable multi-vendor marketplace backend built with Express, Prisma, and PostgreSQL.

## Features

- JWT authentication with HttpOnly cookies
- Role-based access control: `USER`, `SELLER`, `ADMIN`
- Seller onboarding with admin approval and suspension
- Product CRUD with search, pagination, and caching
- IP-based rate limiting
- Clean backend structure with controllers, routers, and middleware

## Tech Stack

- Express
- Prisma
- PostgreSQL
- JSON Web Token
- bcryptjs
- node-cache

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Update `.env` values:


4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Push schema to database:

```bash
npm run prisma:push
```

6. Start the server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start in watch mode
- `npm start` - start the server
- `npm run build` - type-check the project
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:push` - sync schema to database

## API Routes

### Auth

- `POST /auth/sign-up`
- `POST /auth/log-in`
- `POST /auth/log-out`
- `GET /auth/me`

### Sellers

- `POST /marketplace/sellers/apply`
- `GET /marketplace/sellers/me`
- `GET /marketplace/sellers/` - admin only
- `PATCH /marketplace/sellers/:id/approve` - admin only
- `PATCH /marketplace/sellers/:id/suspend` - admin only

### Products

- `GET /marketplace/products/`
- `GET /marketplace/products/:id`
- `POST /marketplace/products/` - verified seller only
- `PUT /marketplace/products/:id` - verified seller only
- `DELETE /marketplace/products/:id` - verified seller only

## Project Structure

```text
src/
  controllers/
  middlewares/
  routers/
  lib/
  types/
prisma/
```

## Notes

- Product list responses are cached for faster reads.
- Only approved sellers can manage products.
- Admins can approve or suspend seller accounts.
