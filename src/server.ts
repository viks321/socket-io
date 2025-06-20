import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import Message from './models/message';
import connectDB from './db/connectDB';
import messagesRoutes from './api/getMessages'

dotenv.config();

export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all origins (Android app)
    methods: ['GET', 'POST'],
    credentials: true
  }
});

connectDB();

app.use(cors());
app.use(express.json());
app.use('/getMessages', messagesRoutes);

// Socket.io communication
io.on('connection', socket => {
  console.log('📱 Android client connected now', socket.id);

  socket.on('sendMessage', async data => {
    const message = new Message({message: data.message,from: data.from,to: data.to});
    await message.save();
    socket.emit('receiveMessage', message);
    socket.broadcast.emit('receiveMessage', message); // send to all clients
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.message === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    process.exit(1); // Exit instead of crashing
  } else {
    throw err;
  }
});


