# HotelFlow - Deployment Guide

This guide describes how to build, configure, and deploy the HotelFlow application (frontend and backend) to a production environment.

---

## 🏗️ Architecture Overview

HotelFlow consists of two main parts:
1.  **Backend API**: Express server running on Node.js using Prisma ORM with SQLite database (port `5000` by default).
2.  **Frontend Dashboard**: Next.js client application styled with Tailwind CSS (port `3000` by default).

---

## 🔌 Environment Variables

Before deploying, ensure you configure the following variables in your hosting environment:

### Backend Configuration
Create or update `backend/.env` (or set the environment variables in your deployment dashboard):

```bash
# Port number for the API server
PORT=5000

# SQLite database connection string
DATABASE_URL="file:./dev.db"
```

### Frontend Configuration
Set these variables during your frontend build step (or in `frontend/.env.production`):

```bash
# The public base URL of the compiled backend API
NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
```

---

## 🚀 Backend Deployment Steps

### 1. Install Dependencies
Run from the `backend/` directory:
```bash
npm install
```

### 2. Initialize Database & Client
Synchronize your SQLite schema and generate the Prisma client code:
```bash
npx prisma generate
npx prisma db push
```
> [!IMPORTANT]
> The `npx prisma db push` command will verify/create the database file and synchronize the SQLite table schemas with the defined Prisma schema.

### 3. Build & Compile TypeScript
Compile the TypeScript code to JavaScript inside the `./dist` folder:
```bash
npm run build
```

### 4. Start the Production Server
Start Node.js to run the compiled API:
```bash
npm run start
```

---

## 🖥️ Frontend Deployment Steps

### 1. Install Dependencies
Run from the `frontend/` directory:
```bash
npm install
```

### 2. Build Production Pages
Compile Next.js, run static optimization, and optimize routes:
```bash
npm run build
```

### 3. Start Production Client
Serve the compiled Next.js build:
```bash
npm run start
```

---

## ⚡ Deployment Platforms

*   **Render / Fly.io / Heroku (Backend)**: Best suited for node/express applications. Set the root folder option to `backend/`. Ensure that the persistent disk mounts to preserve the SQLite database file (`dev.db`).
*   **Vercel / Netlify (Frontend)**: Ideal for Next.js deployments. Point build directory to `frontend/` and configure `NEXT_PUBLIC_API_URL` to point to your deployed backend URL.
