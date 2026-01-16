# FitGlow — Full Stack Fitness Tracker (React + Appwrite)

FitGlow is a full-stack fitness tracking web application built using React (Vite) on the frontend and Appwrite as the backend service.  
It allows users to track workouts, diet, protein intake, and manage weekly workout plans with secure authentication and real-time database updates.

The project focuses on daily activity tracking, streak calculation, weekly analytics, and personalized workout planning.

---

## Live Demo

https://fitglow-fitness-tracker.vercel.app

---

## Core Concepts Implemented

### Frontend (React)

- Functional components with React Hooks (`useState`, `useEffect`)
- Component-based architecture for modular UI
- Controlled forms for workout and meal input
- Centralized authentication checks using session validation
- Dynamic routing using React Router (SPA architecture)
- Conditional rendering based on authentication state
- Reusable UI components (Navbar, Cards, Forms)
- State-driven UI updates after CRUD operations
- Chart visualization using Chart.js
- Responsive UI using Tailwind CSS utility classes

### Backend (Appwrite BaaS)

- Email and password authentication
- Session-based login management
- Database collections with document-based storage
- User-specific document filtering using queries
- Secure CRUD operations through Appwrite SDK

---

## Authentication Flow (Appwrite)

Authentication is implemented using Appwrite Account API:

- User Registration:
  - `account.create()`
  - `account.createEmailPasswordSession()`

- User Login:
  - `account.createEmailPasswordSession()`

- Session Validation:
  - `account.get()` used to protect private routes

- Logout:
  - `account.deleteSession("current")`

Unauthenticated users are redirected to the Login page when accessing protected routes.

---

## Database Design (Appwrite)

### Collections Used

| Collection       | Purpose                         |
|------------------|----------------------------------|
| workouts          | Stores daily workout entries     |
| meals             | Stores diet and protein intake   |
| workout_plans     | Weekly workout planner data      |
| goals             | Reserved for future features     |

### Common Fields

Each document includes:

- `userId`
- `date`
- activity-specific fields

This allows user-specific data fetching using:

```js
Query.equal("userId", user.$id)
