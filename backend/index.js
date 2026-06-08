import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import router from './routes/route.js';
import adminRouter from './routes/adminRoute.js';
import chatRouter from './routes/chatRoute.js';
import http from 'http';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatSocket from './socket/chatSocket.js';

// dotenv is loaded via the top-level import 'dotenv/config'

const app = express();
const PORT = process.env.PORT ||  5001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("",router)
app.use("/admin",adminRouter)
app.use("/chat", chatRouter);

app.use('/uploads', express.static('uploads'));



chatSocket(io);

connectDB();    

// Start Server
if (!process.env.VERCEL) {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Graceful handling for server errors (e.g., port already in use)
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Choose another port or stop the process using it.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

export default app;

