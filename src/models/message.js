"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.default.Schema({
    message: String,
    from: String,
    to: String,
    timestamp: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Message', messageSchema);
