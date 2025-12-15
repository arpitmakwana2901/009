# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository layout (big picture)
This repo is a simple 2-package layout (no root-level workspace scripts):
- `client/`: React + Vite front-end (Tailwind, react-router)
- `server/`: Node.js + Express + MongoDB (mongoose) API

You typically run the front-end and back-end in separate terminals.

## Common development commands (PowerShell)

### Install dependencies
Client:
```pwsh
cd client
npm install
```
Server:
```pwsh
cd server
npm install
```

### Run locally (dev)
Front-end (Vite dev server, default http://localhost:5173):
```pwsh
cd client
npm run dev
```
Back-end (nodemon):
```pwsh
cd server
npm run server
```

### Build / preview (client)
Build:
```pwsh
cd client
npm run build
```
Preview production build:
```pwsh
cd client
npm run preview
```

### Lint (client)
Lint all client files:
```pwsh
cd client
npm run lint
```
Lint a single file (eslint args passthrough):
```pwsh
cd client
npm run lint -- src/pages/Home.jsx
```
Auto-fix:
```pwsh
cd client
npm run lint -- --fix
```

### Tests
- `client/` has no test runner configured.
- `server/` has the default placeholder `npm test` script (it always fails).

## Environment/config notes

### Client env
- `client/src/main.jsx` requires `VITE_CLERK_PUBLISHABLE_KEY`.
- Multiple screens read `VITE_CURRENCY` (e.g. `client/src/pages/MyBookings.jsx`, admin pages).

### API base URL
- The front-end currently hard-codes `export const API_URL = "https://zero09-n1rs.onrender.com";` in `client/src/App.jsx`.
  - For local development, you will usually want to point this to your local server (e.g. `http://localhost:3690`) or refactor to an env-based value.

### Server env
- MongoDB connection string is read from `process.env.MONGODB_URL` in `server/config/db.js`.
- Auth middleware verifies JWTs with `process.env.SECRET_KEY` in `server/middlewere/auth.js`.
  - Note: `server/routes/userRoute.js` signs tokens with the hard-coded secret string `"arpit"`.
    - For local development, set `SECRET_KEY=arpit` (or update code to use `process.env.SECRET_KEY` consistently).
- Server listens on `process.env.PORT || 3690` (`server/index.js`).

## High-level architecture

### Front-end (React/Vite)
Key entrypoints and cross-cutting modules:
- `client/src/main.jsx`: bootstraps React, wraps app with `ClerkProvider`, `AuthProvider`, and `BrowserRouter`.
- `client/src/App.jsx`:
  - Central react-router route table.
  - Detects admin routes via `pathname.startsWith("/admin")` and hides `Navbar`/`Footer` for admin screens.
  - Defines the shared `API_URL` constant used by many API calls.

Auth & routing:
- `client/src/components/context/AuthContext.jsx`: stores a JWT in `localStorage` (`token`) and exposes `isAuthenticated`.
- `client/src/pages/AuthPage.jsx`: calls backend `/user/registration` and `/user/login`, then stores `myToken` via `AuthContext.login(...)`.
- `client/src/components/PrivateRoute.jsx`: blocks routes when `!isAuthenticated` and redirects to `/auth`.

User flows / pages:
- Movie list loads from `GET /shows/getShows` (see `client/src/components/Movies.jsx`).
- Seat selection + booking uses:
  - `GET /seat-layout/:movieId` (load layout)
  - `POST /seat-booking/book-seats` (book seats; requires `Authorization: Bearer <token>`)
  - `GET /checkout` (load bookings; requires auth)
  - `POST /stored/pay-now/:id` (mark booking paid)

Admin UI:
- Admin routes live under `client/src/pages/admin/*` and are mounted at `/admin/*` in `client/src/App.jsx`.
- `client/src/pages/admin/Layout.jsx` composes `AdminNavbar`, `AdminSidebar`, and an `Outlet`.
- `client/src/pages/admin/Dashboard.jsx` loads stats from `GET /adminDashboard`.
- Show creation UI is in `client/src/pages/admin/AddShows.jsx` (posts to `POST /shows/addShow`).

### Back-end (Express/Mongoose)
Server entrypoints:
- `server/index.js`:
  - Sets up CORS + JSON parsing.
  - Mounts route modules under fixed prefixes (e.g. `/shows`, `/seat-layout`, `/checkout`, etc.).
  - Calls `connection()` to connect to MongoDB on startup.

Auth:
- `server/middlewere/auth.js`:
  - Expects `Authorization: Bearer <jwt>`.
  - Sets `req.user` to the decoded JWT payload.

Routes are mostly implemented directly inside `server/routes/*.js` (there’s no separate controller layer).
Important route modules:
- `server/routes/userRoute.js`: register/login and JWT creation.
- `server/routes/addShowRoute.js` (mounted at `/shows`): create/update shows and fetch shows.
- `server/routes/seatLayoutRoute.js` (mounted at `/seat-layout`): store and fetch seat layouts for a movie.
- `server/routes/seatBookingRoute.js` (mounted at `/seat-booking`): marks seats booked in `SeatLayout` and creates a `seat-booking` record.
- `server/routes/checkoutRoute.js` (mounted at `/checkout`): creates/fetches checkout bookings.
- `server/routes/paynowRoute.js` (mounted at `/stored`): marks a checkout booking paid.
- `server/routes/adminDashboardRoute.js` (mounted at `/adminDashboard`): aggregates total bookings/revenue/users and lists active shows.

Data models (Mongo / mongoose):
- Shows: `server/models/addShowModel.js` (includes `showDates` as a `Map<date, times[]>` and a `price`)
- Seat layout: `server/models/seatLayoutModel.js` (per-movie `timeSlots -> categories -> rows -> seats`)
- Seat bookings: `server/models/seatBookingModel.js`
- Checkout bookings / payment status: `server/models/checkoutModel.js`
- Users: `server/models/userModel.js`
- Payments: `server/models/paymentModel.js`

## Other repo-specific notes
- `server/index.js` CORS config explicitly allows `http://localhost:5173` and a Vercel deployment origin.
- There is no root-level `package.json`; commands must be run from `client/` and `server/`.
