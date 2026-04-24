# Mini Bettor

A clean, production-ready mini betting application.

## Tech Stack

*   **Frontend:** React, Tailwind CSS, Lucide React (icons), Motion (animations)
*   **Backend:** Node.js, Express, TSX
*   **Database:** MongoDB (with an in-memory fallback if no connection string is provided)

## Features

### Frontend UI
*   Clean, modern interface with a dark theme.
*   Input field to enter the bet amount.
*   "Place Bet" button.
*   Displays updated balance and Win/Loss result with floating text animations.
*   "Half" and "Max" bet quick-action buttons.
*   Wallet top-up feature allowing users to add balance locally/remotely.
*   Loading state and disable the button while placing a bet.
*   Input validation (no negative bets, handles insufficient funds).

### Backend APIs
*   `GET /api/balance`: Returns the user's current balance.
*   `POST /api/place-bet`: Accepts a bet amount, validates it, and calculates a 50/50 win/loss outcome. Deducts the bet or adds the winnings accordingly.
*   `POST /api/add-balance`: Allows users to add deposit amounts to their wallet balance.

### Business Logic
*   Initial balance is set to **100 USD**.
*   When winning, the bet amount is added to the balance (essentially keeping the bet and gaining an equal amount).
*   Data is stored in MongoDB using Mongoose. If no `MONGODB_URI` environment variable is available, the app falls back to an in-memory state so it still functions in preview modes.

## Project Structure

```
/
├── backend/
│   ├── controllers/      # Route controllers (betController.ts)
│   ├── models/           # Mongoose models (User.ts)
│   └── routes/           # Express routes (betRoutes.ts)
├── src/
│   ├── components/       # React components (BettingTerminal.tsx)
│   ├── lib/              # Utility functions (utils.ts)
│   ├── App.tsx           # Main React component
│   └── main.tsx          # React entry point
├── server.ts             # Express Server entry point & Vite middleware
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## Setup Instructions

### 1. Install Dependencies
Run the following command in the root directory:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example` and add your MongoDB connection string (optional - the app will work in memory without it):
```env
MONGODB_URI="mongodb://localhost:27017/mini-bettor"
```

### 3. Run the Application

This is a full-stack application configured to run both the frontend and backend simultaneously through Express.

To start the development server (Backend + Vite Frontend Middleware):
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the app.

### 4. Production Build

To build the project for production:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Deployment to Render.com

This project includes a `render.yaml` file, making it ready for a true 1-click deployment on [Render](https://render.com/).

### Steps to Deploy:
1. Push this code to a new repository on GitHub (or GitLab).
2. Log into your Render dashboard.
3. Click **New** -> **Blueprint**.
4. Connect the repository containing this code.
5. Render will automatically detect the settings in `render.yaml`. Apply the blueprint!
6. (Optional) Provide your MongoDB Atlas connection string in the Render Dashboard environment settings for `--MONGODB_URI--` if you want persistent data. If left blank, it falls back to the in-memory fallback state.

Your app will be built and deployed automatically!
