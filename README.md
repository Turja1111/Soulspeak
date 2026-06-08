# SoulSpeak

SoulSpeak is a mental wellbeing social platform with posts, companions, chat, and user accounts.

## Repository structure
- `backend/` - Express API, Mongoose models, controllers, routes, socket logic
- `frontend/` - Vite/React frontend
- `uploads/` - Uploaded files (profile images, post images)

## Quick setup

Prerequisites:
- Node.js (16+)
- npm or yarn
- MongoDB running locally or a cloud MongoDB URI

Environment variables (.env):

- `MONGO_URI` - e.g. `mongodb://localhost:27017/soulspeak`
- `PORT` - backend port (default 5000)
- `JWT_SECRET` - secret for signing JWTs
- `EMAIL` / `EMAIL_PASS` - SMTP credentials used for verification and password reset (optional)

Example `.env`:

MONGO_URI=mongodb://localhost:27017/soulspeak
PORT=5000
JWT_SECRET=your_jwt_secret_here

## Run

Backend:

```bash
cd backend
npm install
npm run dev   # or node index.js
```

Frontend (from `frontend/`):

```bash
cd frontend
npm install
npm run dev
```

## Changes & fixes applied

- Ensured environment variables are loaded before other modules by importing `dotenv/config` early in `backend/index.js`.
- Fixed JWT verification to use `process.env.JWT_SECRET` at runtime in `backend/config/middlewares.js` (fallback to `soul` remains for convenience).
- Added a username-uniqueness check in the `signup` controller (`backend/controllers/All.js`) to avoid duplicate usernames.

### Security & reliability improvements implemented

- Rate limiting on auth endpoints using `express-rate-limit` to mitigate brute-force and abuse.
- Input validation for `signup` and `login` using `express-validator` to return clear validation errors.
- Account lockout on repeated failed login attempts (5 failures -> 30 minute lock) to reduce credential stuffing risks.

These are active by default; ensure you run `npm install` to add the new dependencies.

These fixes resolve token verification inconsistencies and common signup conflicts.

## Suggestions & next improvements

- Add rate-limiting on auth endpoints to mitigate brute-force attacks (e.g., `express-rate-limit`).
- Add input validation (e.g., `Joi` or `express-validator`) for all endpoints to return precise errors.
- Store sensitive secrets in a secure vault for production (do not commit `.env`).
- Add account lockout on repeated failed login attempts and email verification required for activation.
- Add unit/integration tests for auth flows and database operations.

## Notes

- The app serves uploaded files from `/uploads` in the backend — ensure the directory exists and is writeable.
- Email functionality requires valid SMTP credentials configured in `.env`.

If you'd like, I can implement any of the suggested improvements (rate limiting, validation, tests, CI), or run the app locally to verify end-to-end behavior.
