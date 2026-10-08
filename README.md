# RiffLog Frontend

The RiffLog frontend is a React and TypeScript web application for tracking guitar practice sessions and viewing practice statistics.

It provides the user-facing interface for the RiffLog API.

## Live Application

https://rifflog.scottstarks.dev

## Related Projects

- **Backend API:** https://github.com/thetramp22/rifflog
- **Live API:** https://api.rifflog.scottstarks.dev

## Features

- User registration and login
- JWT-based authentication
- Protected application routes
- Practice dashboard
- Practice statistics
- Practice-session creation
- Practice-session editing and deletion
- Practice-session filtering
- Practice skill selection
- Responsive navigation and layout
- API error handling and authentication recovery

## Technology Stack

- React 19
- TypeScript
- Vite
- React Router
- Material UI (MUI)
- Fetch API
- RiffLog Go REST API

## Application Structure

The application is organized around a small set of responsibilities:

- **Authentication:** User login, registration, token persistence, logout, and authentication state.
- **Routing:** Public and protected application routes.
- **API Services:** Centralized communication with the RiffLog backend.
- **Pages:** Dashboard, practice sessions, login, and registration views.
- **Components:** Reusable UI and navigation components.

## API Configuration

The frontend reads the backend API URL from the Vite environment variable:

```text
VITE_API_URL
```

For local development, create a `.env.local` file and point it at the API instance you want to use.

Example:

```text
VITE_API_URL=https://api.rifflog.scottstarks.dev
```

The production deployment uses the same deployed API.

## Getting Started

### Prerequisites

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Configure the API

Create `.env.local` and set `VITE_API_URL` to the RiffLog API.

### Start the Development Server

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

### Build for Production

```bash
npm run build
```

The production build is written to the `dist/` directory.

## Authentication

Authentication is managed through a React context that stores the authenticated user and JWT.

The application persists authentication state in local storage so that a page refresh does not immediately end the user's session.

Protected routes redirect unauthenticated users to the login page.

If an authenticated API request returns `401 Unauthorized`, the frontend clears the stored authentication state and returns the user to the unauthenticated application state.

## Production Deployment

The frontend is built into static assets and served through Nginx on the production server.

The production request flow is:

```text
Browser
   |
   | HTTPS
   v
Nginx
   |
   +----> React static files
   |
   +----> /api requests ----> Go API ----> PostgreSQL
```

The frontend and API are deployed under separate production origins, so the API explicitly allows the frontend origin through its CORS configuration.

## Development Notes

The frontend was intentionally developed against the deployed RiffLog API rather than maintaining a separate local backend environment for frontend development.

This keeps the frontend workflow simple while also exercising the same API and authentication behavior used by the deployed application.

## Related Documentation

Backend API documentation is available in the backend repository:

```text
docs/api.md
```
