"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("@repo/backend-common/config");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', (ws, request) => {
    const url = request.url;
    const queryparams = new URLSearchParams(url === null || url === void 0 ? void 0 : url.split('?')[1]);
    const token = queryparams.get("token") || "";
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
    if (!decoded || !decoded.userId) {
        ws.close();
        return;
    }
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server is running on ws://localhost:8080');
({ port: 8080 });
