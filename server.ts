import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Message from './models/message';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all origins (Android app)
    methods: ['GET', 'POST']
  }
});

mongoose.connect('mongodb+srv://vikashraval995:q5EKvXW7AoExUQcG@cluster0.jdj9wvu.mongodb.net/messageDB?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use(cors());
app.use(express.json());

// Optional REST endpoint for old messages
app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Socket.io communication
io.on('connection', socket => {
  console.log('📱 Android client connected');

  socket.on('sendMessage', async data => {
    const message = new Message({ text: data.text });
    await message.save();
    io.emit('receiveMessage', message); // send to all clients
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

