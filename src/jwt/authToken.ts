import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');



module.exports = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token missing' });

  try {
    const decoded = jwt.verify(token, 'supersecretkey123');
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Invalid token' });
  }
};

