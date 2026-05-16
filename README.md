# Finance Tracker App

A modern MERN stack finance tracker app for managing income, expenses, budgets, and savings goals with a clean dashboard UI.

## Features

- User registration and login
- JWT authentication
- Add, edit, and delete transactions
- Track income and expenses
- Dashboard with financial summary
- Income vs expense charts
- Category-wise spending breakdown
- Budget tracking
- Savings goal tracking
- Search, filter, and pagination
- Responsive modern UI

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```bash
finance-tracker-app/
├── backend/
└── frontend/

Installation

Clone the repository:

git clone https://github.com/nishantbisht-dev/finance-tracker-app.git
cd finance-tracker-app

Backend Setup

cd backend
npm install
npm run dev

Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

Frontend Setup

cd frontend
npm install
npm run dev

Create a .env file inside frontend:

VITE_API_URL=http://localhost:5000/api

API Modules

Auth API
Transactions API
Dashboard Analytics API
Budgets API
Goals API

Future Improvements

Export transactions as CSV/PDF
Add recurring transactions
Add profile page
Add light/dark mode toggle
Add AI-based spending insights

Author

Nishant Bisht
GitHub: nishantbisht-dev
