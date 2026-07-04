# SoulSpeak Run Guide

This guide explains how to run the SoulSpeak backend and frontend locally.

## 1. Prerequisites

Install these first:

- Node.js 18 or newer
- npm
- MongoDB locally, or a MongoDB Atlas connection string

Check Node and npm:

```bash
node -v
npm -v
```

## 2. Install Dependencies

Open a terminal in the project root:

```bash
cd D:\Projects\Soulspeak
npm install
```

Then install frontend dependencies:

```bash
cd frontend
npm install
```

Go back to the root when done:

```bash
cd ..
```

## 3. Create the Backend `.env`

Create a `.env` file in the project root:

```text
D:\Projects\Soulspeak\.env
```

Use this template:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/soulspeak
JWT_SECRET=replace_with_a_long_random_secret
EMAIL=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Required Values

- `PORT=5000` is strongly recommended because the frontend currently calls `http://localhost:5000`.
- `MONGO_URI` must point to your MongoDB database.
- `JWT_SECRET` is required for login/session tokens.

### Optional Email Values

`EMAIL` and `EMAIL_PASS` are needed for:

- Email verification
- Password reset emails
- Report status notification emails

If these are not configured, the app can still run, but email-related features may fail.

## 4. Run MongoDB

If you use local MongoDB, make sure MongoDB is running before starting the backend.

Example local URI:

```env
MONGO_URI=mongodb://localhost:27017/soulspeak
```

If you use MongoDB Atlas, use your Atlas connection string instead:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/soulspeak
```

## 5. Run the Backend

Open Terminal 1 in the project root:

```bash
cd D:\Projects\Soulspeak
npm run dev
```

This starts the backend from:

```text
backend/index.js
```

Expected backend URL:

```text
http://localhost:5000
```

If the backend says it started on `5001`, check your `.env` and set:

```env
PORT=5000
```

Then restart the backend.

## 6. Run the Frontend

Open Terminal 2:

```bash
cd D:\Projects\Soulspeak\frontend
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

Open that URL in your browser.

## 7. Login-First App Flow

The app is configured so:

- `/` shows the login page when you are logged out
- `/signup` lets new users create an account
- `/reset-password` handles password reset
- `/home` opens after login
- `/chat`, `/forum`, `/profile`, `/report`, `/admin`, and other app pages require login

## 8. Common Commands

### Backend

Run from the root folder:

```bash
npm run dev
```

### Frontend Dev Server

Run from `frontend/`:

```bash
npm run dev
```

### Frontend Production Build

Run from `frontend/`:

```bash
npm run build
```

### Root Build Command

Run from the root folder:

```bash
npm run build
```

This installs frontend dependencies with `npm ci --prefix frontend` and builds the frontend.

## 9. PowerShell Note

On some Windows machines, PowerShell blocks `npm.ps1`.

If this happens:

```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

Use `npm.cmd` instead:

```powershell
npm.cmd run dev
```

Frontend:

```powershell
cd frontend
npm.cmd run dev
```

Build:

```powershell
npm.cmd run build
```

## 10. Troubleshooting

### Frontend opens but login/signup fails

Most likely the backend is not running, or it is running on the wrong port.

Check backend URL:

```text
http://localhost:5000
```

Make sure `.env` has:

```env
PORT=5000
```

### Backend cannot connect to MongoDB

Check:

- MongoDB is running
- `MONGO_URI` is correct
- Atlas IP access allows your machine, if using MongoDB Atlas
- Database username/password are correct

### Port already in use

If port `5000` is already taken, stop the process using it or change the backend port.

On Windows, you can inspect the port:

```powershell
netstat -ano | findstr :5000
```

If you change the backend port, the frontend API URLs also need to be updated.

### Email verification or password reset fails

Check:

- `EMAIL` is set
- `EMAIL_PASS` is set
- If using Gmail, use an app password instead of your normal password
- The email provider allows SMTP access

### Uploaded images do not show

Check:

- The backend is running
- The `uploads/` folder exists
- The uploaded file exists inside `uploads/`
- The image URL starts with `http://localhost:5000/uploads/...`

## 11. Recommended Local Startup Checklist

1. Start MongoDB.
2. Start backend:

```bash
cd D:\Projects\Soulspeak
npm run dev
```

3. Start frontend:

```bash
cd D:\Projects\Soulspeak\frontend
npm run dev
```

4. Open:

```text
http://localhost:5173
```

5. Login or create a new account.

