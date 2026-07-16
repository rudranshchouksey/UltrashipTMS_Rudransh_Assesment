# Ultraship TMS

> A high-density, performance-optimized, premium Light Theme B2B Transportation Management System (TMS) designed for operational excellence.

## 🌟 Project Concept

Ultraship TMS is built to handle complex logistics workflows with a premium, Stripe-like aesthetic. Designed specifically for high data density, it provides logistics coordinators and administrators with lightning-fast, reactive interfaces to manage shipments, track statuses, and orchestrate supply chain operations without visual clutter.

## 🏗️ Tech Stack Blueprint

The application follows a strictly decoupled architecture, separating the client-side presentation layer from the scalable backend services.

### Frontend UI (Client)
- **Framework**: React 18 & Vite (Lightning-fast HMR and optimized builds)
- **Styling**: Tailwind CSS (Utility-first, strict design token adherence)
- **Animations**: Framer Motion (Hardware-accelerated micro-interactions and layout transitions)
- **State Management**: Apollo Client (GraphQL caching and local state mutations)
- **Deployment**: Vercel (Edge network distribution)

### Backend API (Server)
- **Runtime**: Node.js (V8 Engine performance)
- **API Paradigm**: GraphQL (Strict typing and declarative data fetching)
- **Architecture**: Serverless Functions / Decoupled Micro-services
- **Database Mitigation**: DataLoaders (Resolving N+1 querying inefficiencies)
- **Deployment**: Vercel Serverless

## 🚀 Quickstart Guide

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ultraship-tms.git
cd ultraship-tms
```

### 2. Install Dependencies
Make sure you have Node.js 18+ installed.
```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 3. Environment Variables
Create `.env.local` files in both frontend and backend directories using the provided templates.

**Frontend (`frontend/.env.local`):**
```env
VITE_GRAPHQL_API_URL=http://localhost:4000/graphql
VITE_ENV=development
```

**Backend (`backend/.env`):**
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/ultrashiptms
JWT_SECRET=your_super_secret_key
```

### 4. Run the Development Servers
```bash
# In the backend directory
npm run dev

# In the frontend directory
npm run dev
```

## 👔 Hiring Manager Evaluation Sandbox

Welcome! To easily evaluate the different permission boundaries within the TMS without needing to seed multiple test accounts, we have implemented a **Demo Role-Switcher Widget**.

### How to use the sandbox:
1. Look for the floating **Role Switcher** widget in the bottom-right corner of the UI.
2. Toggle between `ADMIN` and `EMPLOYEE` roles.
3. Observe the dynamic UI changes:
   - **`ADMIN` Mode**: Full access to global analytics, user management routing, billing data, and destructive actions (e.g., deleting a shipment record).
   - **`EMPLOYEE` Mode**: Read-only views for analytics, locked administrative settings, and UI components conditionally rendering to hide sensitive financial metrics. The UI fluidly adapts using Framer Motion layout transitions when permissions shift.

> [!NOTE]
> This role switcher intercepts the GraphQL authorization headers locally, mocking a genuine token re-issuance to simulate real-world RBAC (Role-Based Access Control) behavior.

## 🔗 Live Links

- **Frontend Repository**: [GitHub - Frontend](#)
- **Backend Repository**: [GitHub - Backend](#)
- **Live Deployment (Vercel)**: [https://ultraship-tms.vercel.app](#)
