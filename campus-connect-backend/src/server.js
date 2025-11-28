// server.js
import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initWebSocketServer } from "./realtime/socketManager.js";




dotenv.config();

const server = http.createServer(app);

initWebSocketServer(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📘 API Docs: http://localhost:${PORT}/api/docs`);
});
