"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = __importDefault(require("../models/message"));
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const auth = require('../jwt/authToken');
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const exist = yield User.findOne({ username });
        if (exist)
            return res.status(400).json({ msg: 'User already exists' });
        const hashed = yield bcrypt.hash(password, 10);
        const user = new User({ username, password: hashed });
        yield user.save();
        res.status(201).json({ msg: 'User created' });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User.findOne({ username });
        if (!user)
            return res.status(400).json({ msg: 'Invalid credentials' });
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}));
// Optional REST endpoint for old messages
router.get('/messages', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield message_1.default.find();
    res.json(messages);
}));
exports.default = router;
