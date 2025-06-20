import { Router, Request, Response } from 'express';
import Message from '../models/message';


const router = Router();

// Optional REST endpoint for old messages
router.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

export default router;