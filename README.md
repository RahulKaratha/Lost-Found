# Lost & Found Portal

## Monorepo Commands
- Install all: `npm run install:all`
- Dev (both): `npm run dev`
- Start (preview): `npm start`

## Prerequisites
- Node 18+
- MongoDB running locally or set `MONGO_URI` in `backend/.env`

## Structure
- `backend/`: Express + Mongoose API on `PORT` (default 5000)
- `frontend/lost-and-found/`: React + Vite on port 5173

## Env
- Backend: create `backend/.env` with `MONGO_URI` and `PORT`
- Frontend: optional `frontend/lost-and-found/.env` with `VITE_API_URL`
