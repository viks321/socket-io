"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.default.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Message', messageSchema);

