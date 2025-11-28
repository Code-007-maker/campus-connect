// src/utils/websocket.js
let io = null;

 
export const initWebSocket = async (server) => {
  const { Server } = await import('socket.io');

  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN || '*',
      credentials: true
    }
  });

  console.log('🚀 WebSocket running');

  io.on('connection', (socket) => {
    console.log(`➡️ Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Send message to a specific room or user
 */
export function emit(event, payload, room = null) {
  if (!io) return console.warn("WebSocket not initialized yet");

  if (room) io.to(room).emit(event, payload);
  else io.emit(event, payload);
}

/**
 * Get raw io instance
 */
export function getIO() {
  return io;
}
