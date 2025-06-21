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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const message_1 = __importDefault(require("./models/message"));
const connectDB_1 = __importDefault(require("./db/connectDB"));
const getMessages_1 = __importDefault(require("./api/getMessages"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // allow all origins (Android app)
        methods: ['GET', 'POST'],
        credentials: true
    }
});
(0, connectDB_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/getMessages', getMessages_1.default);
// Socket.io communication
io.on('connection', socket => {
    console.log('📱 Android client connected now', socket.id);
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new message_1.default({ message: data.message, from: data.from, to: data.to });
        yield message.save();
        socket.emit('receiveMessage', message); // send to sender client only
        socket.broadcast.emit('receiveMessage', message); // send to all receiver clients only
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
