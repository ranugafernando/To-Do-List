# To-Do List (MERN)

A to-do list app with user accounts, multiple lists, tasks with deadlines, and overdue indicators.
The React frontend and the Express/Node.js backend are separate apps that talk over a REST API,
with data stored in MongoDB through Mongoose.

## Features

- Register and log in (passwords hashed with bcrypt, sessions via JWT)
- Create, rename and delete your own lists
- Add, edit, complete and delete tasks in each list
- Optional deadline per task, with overdue tasks flagged
- Each user only ever sees their own lists and tasks

## Tech stack

| Part | Built with |
|---|---|
| Frontend | React 18, Vite 5 |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Auth | JSON Web Tokens, bcryptjs |

## Project structure

```
backend/
  server.js          Express app, CORS, routes, MongoDB connection
  middleware/auth.js JWT check for protected routes
  models/            User, List, Task schemas
  routes/            auth, lists, tasks
frontend/
  src/api.js         fetch wrapper for the API
  src/context/       app state (user, lists, tasks)
  src/components/    AuthScreen, Sidebar, TaskList, TaskCard
```

## Getting started

You need Node.js 18+ and a MongoDB database (local, or a free MongoDB Atlas cluster).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | What it is |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long random string, used to sign login tokens |

Then start it:

```bash
npm run dev    # with auto-reload (nodemon)
# or
npm start
```

The API runs at `http://localhost:5000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend calls `http://localhost:5000/api` by default. To point it somewhere else, set
`VITE_API_URL` in `frontend/.env`. The backend only accepts requests from `http://localhost:5173`
and `http://localhost:3000` (see the CORS setting in `backend/server.js`).

## API

All list and task routes need an `Authorization: Bearer <token>` header.

| Method | Route | What it does |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a token |
| GET | `/api/auth/me` | The signed-in user |
| GET | `/api/lists` | Your lists |
| POST | `/api/lists` | Create a list |
| PUT | `/api/lists/:id` | Rename a list |
| DELETE | `/api/lists/:id` | Delete a list |
| GET | `/api/tasks/:listId/tasks` | Tasks in a list |
| POST | `/api/tasks/:listId/tasks` | Add a task to a list |
| PUT | `/api/tasks/:id` | Update a task (title, description, deadline, completed) |
| DELETE | `/api/tasks/:id` | Delete a task |

## Production build

```bash
cd frontend
npm run build    # output goes to frontend/dist
```
