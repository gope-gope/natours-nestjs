# Natours API (NestJS)

A NestJS REST API inspired by the “Natours” app: tours, users, auth, and reviews backed by MongoDB (Mongoose). Includes request validation, consistent response formatting, and Swagger docs.

## Key features

- **Tours**: CRUD, top-5-cheap, stats, monthly plan, geospatial queries (within distance, distances)
- **Auth**: signup/login, JWT stored in an **httpOnly cookie**, forgot/reset password (email)
- **Users**: update profile (“me”), update password, admin-only user management
- **Reviews**: fetch reviews for a tour
- **DX**: global validation pipe, global exception filters, global response interceptor, Swagger at `/api`

## Tech stack

- **Framework**: NestJS
- **DB**: MongoDB + Mongoose
- **Auth**: JWT (`jsonwebtoken`) + cookies (`cookie-parser`)
- **Email**: Nodemailer (configured for Mailtrap-style SMTP)
- **Validation**: `class-validator` / `class-transformer`
- **Docs**: `@nestjs/swagger`

## Getting started

### Prerequisites

- **Node.js**: any recent Node version should work; the project uses pnpm
- **pnpm**: `npm i -g pnpm`
- **MongoDB**: local or Atlas connection string

### Install

```bash
pnpm install
```

### Configure environment variables

1. Create `.env` (do not commit it):

```bash
cp .env.example .env
```

2. Fill the values in `.env` (see “Environment variables” below).

> Important: if you ever committed real secrets, rotate them (DB user/password, JWT secret, SMTP creds).

### Run

```bash
# development (SWC)
pnpm start

# watch mode
pnpm start:dev
```

The API listens on **`http://localhost:8000`**.

## API documentation (Swagger)

Once running, open:

- **Swagger UI**: `http://localhost:8000/api`

## Main routes (high level)

Base URL: `http://localhost:8000`

### Auth

- `POST /signup`
- `POST /login` (sets `jwt` httpOnly cookie)
- `POST /forgot-password`
- `POST /reset-password/:token`

### Tours

- `GET /tours`
- `GET /tours/:id`
- `GET /tours/top-5-cheap`
- `GET /tours/tour-stats`
- `GET /tours/monthly-plan/:year` (**roles**: `admin`, `guide`)
- `GET /tours/tours-within/:distance/center/:latlng/unit/:unit`
- `GET /tours/distances/:latlng/unit/:unit`
- `POST /tours` (**role**: `admin`)
- `PATCH /tours/:id` (**role**: `admin`)
- `DELETE /tours/:id` (**role**: `admin`)

### Users

- `GET /users`
- `GET /users/:id`
- `PATCH /users/update-me` (authenticated)
- `PATCH /users/update-my-password` (authenticated)
- `PATCH /users/:id` (**role**: `admin`)
- `DELETE /users/:id` (**role**: `admin`)

### Reviews

- `GET /reviews/:id` (reviews for a tour id)

## Environment variables

The app uses `@nestjs/config` and reads `.env` at startup.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | JWT signing secret (recommend 32+ chars) |
| `JWT_EXPIRES_IN` | yes | JWT expiration (e.g. `1h`) |
| `JWT_COOKIE_EXPIRES_IN` | yes | Cookie expiration (days) |
| `EMAIL_USERNAME` | for emails | SMTP username |
| `EMAIL_PASSWORD` | for emails | SMTP password |
| `EMAIL_HOST` | for emails | SMTP host |
| `EMAIL_PORT` | for emails | SMTP port |

## Useful scripts

```bash
pnpm build
pnpm start:prod

pnpm lint
pnpm format

pnpm test
pnpm test:e2e
pnpm test:cov
```

## Project structure

```text
src/
  app.module.ts
  main.ts
  auth/
  tours/
  users/
  reviews/
  common/   # guards, filters, interceptors, decorators, shared DTOs
  utils/    # jwt, email, apiFeatures
```

## Notes / troubleshooting

- **Auth cookie**: `POST /login` sets a `jwt` cookie. When calling protected routes from a client, ensure cookies are included (`credentials: 'include'` in `fetch`, `withCredentials: true` in axios).
- **Mongo connection**: if startup fails, validate `DB_URL` and IP allowlist (Atlas).
- **Email**: password reset relies on SMTP settings; use Mailtrap (or another SMTP provider) for local testing.
