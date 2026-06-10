# 🏨 HotelFlow — Hotel Management Reimagined

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Backend-Express%205-lightgrey?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%207-indigo?logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://typescriptlang.org)

HotelFlow is a premium, high-performance, dark-themed hotel management platform designed to streamline reservations, front desk check-ins, housekeeping tasks, staff permissions, and real-time revenue ledger tracking.

---

## ✨ Features

### 📊 Interactive Bento Dashboard
*   **Real-time Analytics**: Displays live statistics (Total Rooms, Occupancy Rates, Today's Revenue, and Pending Departures).
*   **Visual Trends**: Renders smooth financial graphics (Occupancy and Revenue curves) using Recharts.

### 📅 Advanced Bookings Desk
*   **Reservations Log**: Create, review, and filter bookings seamlessly.
*   **Inline Guest Creation**: Register new guest profiles directly within the booking panel.

### 🛎️ Front Desk Check-in & Check-out
*   **Visual Board**: Segregated columns for "Pending Arrivals" and "Active Guests" for easy tracking.
*   **Auto Checkout Calculator**: Computes night stay durations, applies pricing modifiers, accepts payment method inputs, logs ledger invoices, and flags checkout rooms for housekeeping.

### 🧹 Live Housekeeping Logger
*   **Dynamic Room Control**: Toggle cleaning states (`CLEAN`, `CLEANING`, `DIRTY`) instantly.
*   **Staff Dispatching**: Assign housekeeper staff directly to cleaning tasks.

### 💳 Invoices & Payments Ledger
*   **Billing Ledger**: Keeps a full audit list of transactions.
*   **Custom Adjustments**: Record manual inputs for restaurant fees, damage deposits, or cash adjustments.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Features |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (App Router)** | Client-side data rendering, premium Framer Motion animations. |
| **Backend** | **Express (TypeScript)** | Modular routing structure, centralized error middleware. |
| **Database & ORM** | **SQLite & Prisma 7** | Relational schema definition, SQL transactions. |
| **Styling** | **Vanilla CSS + Tailwind CSS** | Sleek, glassmorphism UI styled using tailwind classes. |

---

## 📂 Project Structure

```bash
hotelflow/
├── backend/                   # Express backend API
│   ├── prisma/
│   │   └── schema.prisma      # Prisma database schemas
│   ├── src/
│   │   ├── routes/            # Modular route controllers
│   │   │   ├── bookings.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── housekeeping.ts
│   │   │   └── rooms.ts
│   │   └── index.ts           # App setup & middleware
│   ├── tsconfig.json          # TS compilation options
│   └── package.json
│
├── frontend/                  # Next.js client
│   ├── src/
│   │   ├── app/               # Routes & layouts
│   │   │   ├── (dashboard)/   # Admin panels
│   │   │   └── (marketing)/   # Landing Page
│   │   ├── components/        # Shared components
│   │   └── utils/
│   │       └── api.ts         # Centralized API URLs
│   └── package.json
│
└── DEPLOYMENT.md              # Deployment Guide
```

---

## 🚀 Quick Start

### 1. Prerequisites
*   Node.js (v18.x or later)
*   npm or yarn

### 2. Setting Up the Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Configure database and generate the Prisma client:
    ```bash
    npx prisma db push
    ```
4.  Run the server in development mode:
    ```bash
    npm run dev
    ```
    *The API will start at `http://localhost:5000`.*

### 3. Setting Up the Frontend
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Run the client in development mode:
    ```bash
    npm run dev
    ```
    *The website will be served at `http://localhost:3000`.*

---

## 📄 Deployment

For advanced production setup, database synchronization instructions, and environment variables configurations, please refer to the main [DEPLOYMENT.md](file:///c:/Users/MS/.gemini/antigravity-ide/scratch/hotelflow/DEPLOYMENT.md) file.
