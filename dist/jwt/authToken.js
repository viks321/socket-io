"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: 'Token missing' });
    try {
        const decoded = jwt.verify(token, 'supersecretkey123');
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ msg: 'Invalid token' });
    }
};
