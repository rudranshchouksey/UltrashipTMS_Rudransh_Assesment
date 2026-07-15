# Ultraship TMS (Transportation Management System)

Welcome to the Ultraship TMS project. This application provides a modern, scalable platform for managing logistics and supply chain operations, featuring a robust Node.js/GraphQL backend and a performant React frontend with Role-Based Access Control (RBAC).

## Architecture & Performance Features

This project was built with scale, performance, and maintainability in mind:

- **GraphQL API (Apollo Server):** Provides a strongly-typed, flexible API layer that prevents over-fetching and under-fetching of data. The frontend requests exactly what it needs to render.
- **Dataloader Pattern:** Integrated on the backend to solve the N+1 query problem, ensuring that relationships (like fetching a Shipper or Carrier for a list of 50 shipments) are batched and cached within a single request.
- **Cursor-Based Pagination:** The `shipments` query supports Relay-style cursor pagination (`first`, `after`). This guarantees consistent list performance at scale, avoiding the pitfalls of offset-based pagination on large datasets.
- **Database Indexing Strategy:**
  - Compound indexes on `(status, pickupDate)` and `(carrierId, status)` to rapidly serve common dashboard filters.
  - Unique indexes on `trackingNumber` to ensure data integrity.
- **Glassmorphism UI:** Built with Tailwind CSS and Framer Motion for a fluid, premium aesthetic.

## Quickstart

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Running the Backend

1. Navigate to the root directory:
   ```bash
   cd "Ultraship TMS"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:4000/graphql`):
   ```bash
   npm run dev
   ```

### Running the Frontend

1. Navigate to the client directory:
   ```bash
   cd "Ultraship TMS/client"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL in your browser.

## Testing RBAC (Admin vs. Employee)

We've implemented a robust Role-Based Access Control (RBAC) system. The frontend uses Apollo Client to attach a custom `x-user-role` header to every GraphQL request, which the backend context parses to enforce field and mutation-level authorization.

**How to Test:**
1. Open the app in your browser.
2. In the top navigation bar, locate the **Role Toggle Button** (labeled either `ADMIN` or `EMPLOYEE`).
3. Click the button to instantly switch your active role.
4. **Observe the UI changes:**
   - As an `ADMIN`, click on a shipment card. In the detailed panel, you will see an **"Update Status"** button. You will also see a **"Delete"** option when clicking the context menu (three dots) on a shipment card.
   - Switch to `EMPLOYEE` and repeat the process. Notice that administrative actions (Update Status, Delete) are dynamically hidden, preventing unauthorized actions at the UI level (and secured at the API level).

---

## Deployment Guide

Deploying this stack is designed to be frictionless. We recommend **Railway/Render** for the Node.js Backend and **Vercel/Netlify** for the React Frontend.

### 1. Backend Deployment (Render / Railway)

1. **Create a New Web Service:** Connect your GitHub repository to Render or Railway.
2. **Configuration:**
   - **Root Directory:** `./` (the root folder).
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. **Environment Variables:**
   - `PORT`: Usually automatically injected, but set to `4000` if required.
   - `FRONTEND_URL`: Set this to your deployed Vercel URL (e.g., `https://ultraship-tms.vercel.app`). *This is critical for CORS.*
   - `DATABASE_URL`: Your production connection string.
4. **CORS Setup:** The backend `cors` middleware is configured to accept requests from `process.env.FRONTEND_URL`. Ensure this perfectly matches your deployed frontend domain.

### 2. Frontend Deployment (Vercel / Netlify)

1. **Create a New Project:** Connect your GitHub repository to Vercel/Netlify.
2. **Configuration:**
   - **Root Directory:** `./client` (Important! Tell the platform the frontend lives in the `client` folder).
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables:**
   - `VITE_GRAPHQL_URL`: Set this to your deployed backend URL (e.g., `https://ultraship-backend.onrender.com/graphql`).

### Zero-Friction Checklist
- [x] Backend CORS accepts the exact `FRONTEND_URL`.
- [x] Frontend Apollo Client is pointed at the exact `VITE_GRAPHQL_URL`.
- [x] Backend `PORT` is bound to the environment-provided port (`process.env.PORT || 4000`).
