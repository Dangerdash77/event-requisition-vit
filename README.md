# VIT Events - Fullstack Project

This package includes:
- frontend/  (React app)
- backend/   (Express + MongoDB API)

Instructions:
1. Start MongoDB (e.g. mongod)
2. Backend:
   cd backend
   npm install
   copy .env.example to .env and edit MONGO_URI if needed
   npm run dev
3. Frontend:
   cd frontend
   npm install
   npm start

The frontend will POST form data to http://localhost:5000/api/events by default.
