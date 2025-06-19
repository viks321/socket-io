"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Message', messageSchema);
exports.app = (0, express_1.default)();
