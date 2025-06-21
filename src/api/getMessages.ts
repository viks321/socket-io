import { Router, Request, Response, NextFunction } from 'express';
import Message from '../models/message';
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const auth = require('../jwt/authToken');

const router = Router();


router.post('/register', async (req: Request,res:Response) =>{

  const { username, password } = req.body;
  try {
    const exist = await User.findOne({ username });
    if (exist) return (res as any).status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    res.status(201).json({ msg: 'User created' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }

});

router.post('/login', async (req: Request,res:Response) =>{

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return (res as any).status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error'+err });
  }
  
});

// Optional REST endpoint for old messages
router.get('/messages',auth, async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

export default router;