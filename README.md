# Synthesia - Full-Stack Music Streaming App

Synthesia is a full-stack music player built with a React + Redux frontend and an Express + MongoDB backend. It supports authenticated user flows, playlist discovery, search by tag/mood, audio playback controls, and user-specific favourites.

This README is designed for both:
- Developers who want to run, debug, and extend the project
- Resume/portfolio extraction of technical depth and professional skills

## Table of Contents

- [1. Project Snapshot](#1-project-snapshot)
- [2. Architecture](#2-architecture)
- [3. Repository Structure](#3-repository-structure)
- [4. Tech Stack](#4-tech-stack)
- [5. Quick Start](#5-quick-start)
- [6. Environment Variables](#6-environment-variables)
- [7. Available Scripts](#7-available-scripts)
- [8. API Reference](#8-api-reference)
- [9. Core Frontend Flows](#9-core-frontend-flows)
- [10. Developer Workflow](#10-developer-workflow)
- [11. Troubleshooting](#11-troubleshooting)
- [12. Professional Work Methods Demonstrated](#12-professional-work-methods-demonstrated)
- [13. High-Value Resume Bullets](#13-high-value-resume-bullets)
- [14. Roadmap / Next Upgrades](#14-roadmap--next-upgrades)

## 1. Project Snapshot

- Project type: Full-stack web application (MERN-style)
- Frontend: React (Vite), Redux Toolkit, modular component architecture
- Backend: Express (Node.js ESM), MongoDB (Mongoose), JWT authentication
- Integrations:
  - Jamendo API for public music catalog and stream URLs
  - ImageKit for avatar upload and delivery
  - Mailtrap + Nodemailer for password reset emails

User capabilities:
- Browse curated playlists by tags (Workout, Chill, Happy, etc.)
- Search songs dynamically by keyword/tag
- Play tracks with a custom player (play/pause, seek, next/prev, loop, shuffle, speed, volume, mute)
- Signup/login/logout with JWT sessions
- Edit profile details and avatar
- Forgot/reset password flow
- Save and manage favourite songs

## 2. Architecture

High-level flow:

1. Frontend calls backend APIs using `VITE_BASE_URL`
2. Backend handles auth/business logic and proxies Jamendo requests
3. MongoDB stores users, profile details, and favourites
4. ImageKit stores user avatars
5. Mailtrap SMTP sends reset-password emails

Backend layering:
- `routes` -> `controllers` -> `models`
- `middleware` for auth guards
- `config`/`utils` for DB, ImageKit, mail

Frontend layering:
- `pages` compose screen-level behavior
- `components` handle UI features
- `hooks/useAudioPlayer` manages player state machine
- Redux slices separate `auth` and `ui` concerns

## 3. Repository Structure

```text
Music-app-synthesia/
  backend/
    config/            # DB + ImageKit configuration
    controllers/       # Auth + songs business logic
    Middleware/        # JWT auth guard
    models/            # Mongoose schemas
    routes/            # API routes
    utils/             # Email utility
    index.js           # Server bootstrap
  frontend/
    src/
      components/      # auth, layout, player, songs, search, common
      hooks/           # useAudioPlayer custom hook + reducer pattern
      pages/           # Homepage orchestration
      redux/           # store + auth/ui slices
      css/             # feature-wise styling files
```

## 4. Tech Stack

Frontend:
- React 19
- Vite 7
- Redux Toolkit + React Redux
- React Router DOM
- Axios
- Validator
- React Icons
- Tailwind/PostCSS toolchain configured (project styling mainly uses modular CSS files)

Backend:
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt
- Nodemailer
- ImageKit SDK
- Axios
- Dotenv

External services:
- Jamendo API (`/tracks`)
- ImageKit
- Mailtrap SMTP

## 5. Quick Start

Prerequisites:
- Node.js 18+
- npm
- MongoDB instance (local or cloud)
- ImageKit credentials
- Mailtrap SMTP credentials (or compatible SMTP provider)

Install and run:

```bash
# 1) Backend
cd backend
npm install
npm run dev

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## 6. Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

MAILTRAP_HOST=your_mailtrap_host
MAILTRAP_PORT=your_mailtrap_port
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:5001
```

## 7. Available Scripts

Backend (`backend/package.json`):
- `npm run dev` - start backend server
- `npm test` - placeholder script (currently no automated tests configured)

Frontend (`frontend/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - run ESLint

## 8. API Reference

Base URL: `http://localhost:<PORT>/api`

Auth routes:
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (protected)
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `PATCH /auth/profile` (protected)

Songs routes:
- `GET /songs`
- `GET /songs/playlistByTag/:tag`
- `POST /songs/favourite` (protected)
- `GET /songs/favourites` (protected)

Example cURL calls:

```bash
# Signup
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'

# Fetch songs
curl http://localhost:5001/api/songs
```

## 9. Core Frontend Flows

Auth flow:
- Token is stored in localStorage after login/signup
- On app boot, `/api/auth/me` verifies token and hydrates user state
- `uiSlice` drives auth modal mode (`login`, `signup`, `forgot`)

Audio flow:
- `useAudioPlayer` uses reducer events (`PLAY`, `PAUSE`, `SET_CURRENT_TRACK`, etc.)
- Footer receives player state + controls as props
- Supports seek, volume normalization, mute restore, loop/shuffle, playback speed

Data flow:
- Homepage fetches initial songs from `/api/songs`
- Search triggers debounced calls (~500ms)
- Favourites update both backend and Redux `auth.user.favourites`

## 10. Developer Workflow

Recommended local workflow:

1. Pull latest changes and install dependencies
2. Create/update `.env` files
3. Run backend and frontend in separate terminals
4. Validate auth flow first (signup/login/me)
5. Validate playback + favourites flow
6. Run `npm run lint` inside `frontend` before pushing

Code organization conventions used:
- Feature-based component directories
- Central Redux store with isolated slices
- Backend route/controller/model separation
- Utility/config extraction for external services

## 11. Troubleshooting

- Frontend cannot reach backend:
  - Check `VITE_BASE_URL` in `frontend/.env`
  - Ensure backend is running on matching `PORT`

- `401 Not authorized` on protected routes:
  - Ensure `Authorization: Bearer <token>` is sent
  - Confirm `JWT_SECRET` is set and stable

- Password reset email not received:
  - Verify Mailtrap SMTP env values
  - Check backend logs for nodemailer transport errors

- Avatar upload fails:
  - Verify ImageKit keys and URL endpoint
  - Confirm frontend sends base64 image in request body

- Mongo connection issues:
  - Validate `MONGO_URL`
  - Ensure DB network access/IP allowlist is configured

## 12. Professional Work Methods Demonstrated

- Full-stack ownership across UI, state, API, database, and external services
- Layered architecture and separation of concerns
- Reusable components and custom-hook driven frontend design
- Reducer-based state machine approach for complex media interactions
- Secure auth lifecycle with password hashing + JWT middleware
- Account recovery flow with cryptographic token hashing + expiry validation
- Asynchronous error handling and user feedback paths
- Debounced search for better performance and lower API load

## 13. High-Value Resume Bullets

Use/adapt these directly:

- Built a full-stack music streaming web app using React, Redux Toolkit, Express, and MongoDB.
- Designed and implemented JWT-based authentication with protected APIs and session rehydration.
- Developed a secure password-reset mechanism using hashed reset tokens with expiration.
- Integrated Jamendo music APIs and ImageKit cloud media storage into backend workflows.
- Implemented a custom reducer-driven React audio player supporting playback controls, seek, loop, shuffle, speed, and volume.
- Engineered user personalization through persistent favourites and profile management.
- Structured scalable frontend state with slice-based Redux architecture and clear UI/auth boundaries.
- Applied modular code organization and maintainability-focused component design.

## 14. Roadmap / Next Upgrades

Production-focused next steps:
- Add backend integration tests and frontend component/hook tests
- Add request validation layer (Zod/Joi/express-validator)
- Move all hardcoded external config values to environment variables
- Add centralized error middleware and structured logging
- Add CI pipeline (`lint`, `test`, `build` gates)
- Add Dockerized local/dev deployment setup
- Add refresh tokens and role-based authorization model

---

If you want, I can also generate a separate `README.resume.md` that is shorter and purely ATS/recruiter-oriented while keeping this file developer-focused for GitHub.
