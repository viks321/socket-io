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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var dotenv_1 = require("dotenv");
var cors_1 = require("cors");
var message_1 = require("./models/message");
var connectDB_1 = require("./db/connectDB");
var getMessages_1 = require("./api/getMessages");
dotenv_1.default.config();
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
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
io.on('connection', function (socket) {
    console.log('📱 Android client connected now', socket.id);
    socket.on('sendMessage', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = new message_1.default({ message: data.message, from: data.from, to: data.to });
                    return [4 /*yield*/, message.save()];
                case 1:
                    _a.sent();
                    socket.emit('receiveMessage', message); // send to sender client only
                    socket.broadcast.emit('receiveMessage', message); // send to all receiver clients only
                    return [2 /*return*/];
            }
        });
    }); });
});
var PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
    console.log("\uD83D\uDE80 Server running on http://localhost:".concat(PORT));
}).on('error', function (err) {
    if (err.message === 'EADDRINUSE') {
        console.error("\u274C Port ".concat(PORT, " is already in use."));
        process.exit(1); // Exit instead of crashing
    }
    else {
        throw err;
    }
});
