# SoulSpeak

SoulSpeak is a 7 Cups-inspired mental wellness and peer-support web app. It gives members a guided entry flow, community posting, trained companion assessment, real-time chat, reporting, and admin moderation tools.

The app is built as a MERN-style project with a Vite React frontend and an Express/MongoDB backend.

## Features

- Login, signup, JWT authentication, logout, and protected app routes
- Login-first entry flow: unauthenticated users land on the login page, then go to `/home` after signing in
- Guided onboarding that collects referral source, condition, age group, gender, country, goals, and support preferences
- Profile dashboard with editable details, password update, email verification, and profile picture upload
- Companion assessment using admin-managed questions
- Companion training page with learning resources
- Real-time one-to-one chat with Socket.IO
- Companion discovery for members
- Community forum with categories, image posts, comments, upvotes, editing, and deletion
- User reporting for reviews, profile reports, and chat reports
- Admin panel for questions, users, reports, PDF export, and account suspension/reactivation
- Uploaded media served from the `uploads/` directory

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Lucide React icons
- jsPDF / jspdf-autotable for report exports

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT authentication
- bcrypt password hashing
- multer image uploads
- nodemailer email flows
- helmet, express-rate-limit, and express-validator

## Repository Structure

```text
Soulspeak/
  api/
    index.js                 # Vercel serverless entry that exports the Express app
  backend/
    config/                  # Database and middleware config
    controllers/             # API controller logic
    models/                  # Mongoose models
    routes/                  # Express routes
    socket/                  # Socket.IO chat setup
    index.js                 # Express app/server entry
  frontend/
    src/
      pages/                 # React pages
      App.jsx                # App shell, navigation, auth route guards
      index.css              # Tailwind and shared UI styles
    package.json             # Frontend scripts/dependencies
  uploads/                   # Uploaded images
  documentation.pdf          # Project documentation generated from code review
  RUN_GUIDE.md               # Local run instructions
  package.json               # Backend/root scripts and dependencies
  vercel.json                # Vercel routing/build configuration
```

## Local Setup

See [RUN_GUIDE.md](./RUN_GUIDE.md) for the complete run guide.

Short version:

```bash
npm install
cd frontend
npm install
```

Create a root `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/soulspeak
JWT_SECRET=replace_with_a_strong_secret
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend from the root folder:

```bash
npm run dev
```

Start the frontend from another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Important Local Port Note

The frontend currently calls the backend at:

```text
http://localhost:5000
```

For local development, set this in the root `.env`:

```env
PORT=5000
```

If the backend starts on another port, login, signup, chat, posts, reports, and profile requests will fail until the frontend API URL or backend port is aligned.

## Available Commands

Run from the project root:

```bash
npm run dev
```

Starts the Express backend with nodemon.

```bash
npm run build
```

Installs frontend dependencies with `npm ci --prefix frontend` and builds the frontend.

Run from `frontend/`:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the React app into `frontend/dist`.

```bash
npm run preview
```

Previews the production frontend build locally.

```bash
npm run lint
```

Runs ESLint for the frontend.

## Main Routes

### Public Frontend Routes

- `/` - Login page
- `/signup` - Account creation
- `/reset-password` - Password reset confirmation

### Protected Frontend Routes

- `/home` - Home/dashboard after login
- `/chat` - Companion chat
- `/forum` - Community forum
- `/profile` - Member profile
- `/report` - Reports
- `/become-a-companion` - Companion assessment
- `/training-program` - Companion training resources
- `/admin` - Admin panel

### Backend Route Groups

- Auth/profile: `/signup`, `/login`, `/profile`, `/verify-email`, `/reset-password`
- Forum: `/posts`, `/posts/:id/upvote`, `/posts/:id/comments`
- Companion: `/companion`, `/companions`, `/questions`
- Reports: `/reports`, `/admin/reports/:id/status`
- Admin: `/admin/questions`, `/admin/users`, `/admin/suspend`, `/admin/activate`
- Chat: `/chat`, `/chat/create`, `/chat/send`
- Uploads: `/uploads/...`

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Recommended | Backend port. Use `5000` for current frontend defaults. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. |
| `EMAIL` | For email flows | Email account used by nodemailer. |
| `EMAIL_PASS` | For email flows | App password/SMTP password for the email account. |
| `VERCEL` | Deployment | Used by the backend to avoid starting a listener in Vercel serverless mode. |

Do not commit real `.env` secrets to GitHub.

## Deployment Notes

The repo includes `vercel.json` and `api/index.js`.

- `api/index.js` exports the Express app for Vercel.
- `vercel.json` points Vercel to `frontend/dist` and rewrites `/api/*` requests to the serverless API entry.
- The frontend has an Axios interceptor in `App.jsx` that rewrites `http://localhost:5000` to `/api` when not running on localhost.

Before deploying, configure environment variables in the hosting provider and run a production build.

## Known Notes

- The current frontend has hardcoded local API calls in several pages. The production interceptor helps, but a future improvement would be a shared API client using `import.meta.env.VITE_API_URL`.
- Socket typing events are partially wired on the frontend, but the backend socket currently focuses on room joins and new message/new chat events.
- Uploaded files are stored locally under `uploads/`; production deployments may need durable object storage.
- Automated tests are not currently included.

## Documentation

Additional project documentation is available in:

- [documentation.pdf](./documentation.pdf)
- [RUN_GUIDE.md](./RUN_GUIDE.md)

