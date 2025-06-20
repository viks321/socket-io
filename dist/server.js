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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const message_1 = __importDefault(require("./models/message"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(exports.app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // allow all origins (Android app)
        methods: ['GET', 'POST'],
        credentials: true
    }
});
mongoose_1.default.connect('mongodb+srv://vikashraval995:S7Rm9ZXMvvqpUBMY@chatmessagedb.z4twiua.mongodb.net/messageDB?retryWrites=true&w=majority')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
// Optional REST endpoint for old messages
exports.app.get('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield message_1.default.find();
    res.json(messages);
}));
// Socket.io communication
io.on('connection', socket => {
    console.log('📱 Android client connected now', socket.id);
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new message_1.default({ message: data.message, from: data.from, to: data.to });
        yield message.save();
        socket.emit('receiveMessage', message);
        socket.broadcast.emit('receiveMessage', message); // send to all clients
    }));
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.message === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1); // Exit instead of crashing
    }
    else {
        throw err;
    }
});
