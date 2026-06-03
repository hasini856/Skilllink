# SkillLink

A full-stack MERN application for connecting people who want to share and learn skills.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

## Project structure

```
skilllink/
├── backend/          # Express API
│   └── src/
│       ├── config/       # Database connection
│       ├── controllers/  # Route handlers
│       ├── middleware/   # Auth, error handling
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API routes
│       └── utils/        # Helpers
├── frontend/         # React app
│   └── src/
│       ├── components/   # Reusable UI
│       ├── layouts/      # Page layouts
│       ├── pages/        # Route pages
│       ├── routes/       # React Router config
│       └── services/     # API client
└── package.json      # Root scripts
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Configure the backend:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with your MongoDB URI.

3. Start the API (port 5000):

   ```bash
   npm run dev:backend
   ```

4. In a second terminal, start the frontend (port 5173):

   ```bash
   npm run dev:frontend
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## API routes

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/health`      | Health check       |
| POST   | `/api/auth/register` | Register (JWT)   |
| POST   | `/api/auth/login`    | Login (JWT)      |
| GET    | `/api/auth/me`       | Current user (auth required) |
| GET    | `/api/users`         | List users (stub)|
| GET    | `/api/skills`        | List skills (stub)|

## Frontend routes

| Path            | Page      |
|-----------------|-----------|
| `/`             | Home      |
| `/skills`       | Skills    |
| `/login`        | Login     |
| `/register`     | Register (role: Learner or Mentor) |
| `/learner/dashboard` | Learner dashboard (protected) |
| `/mentor/dashboard`  | Mentor dashboard (protected) |
| `/profile/:id`  | Profile   |
