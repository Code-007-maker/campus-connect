// src/realtime/socketManager.js
import WebSocket, { WebSocketServer } from "ws";
import { SOCKET_ORIGIN } from "../config/env.js";
import { handleNotification } from "./notificationHandler.js";

let wss;

export const initWebSocketServer = (server) => {
  wss = new WebSocketServer({ server, path: "/ws", clientTracking: true });

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket connection established.");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received WS message:", data);

        // Handle notification event
        if (data.type === "notification") {
          handleNotification(data);
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });

    ws.send(JSON.stringify({ type: "connection", message: "Connected to Campus Connect WS server" }));
  });

  console.log(`WebSocket server running on origin: ${SOCKET_ORIGIN}`);
};

export const broadcastMessage = (message) => {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
