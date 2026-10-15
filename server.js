const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e6 });
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ ok: true, app: 'Mera Gallery' }));

// Pairing codes are temporary room identifiers. No photos pass through this server.
io.on('connection', socket => {
  socket.on('join-room', ({ code, deviceName }) => {
    if (typeof code !== 'string' || !/^[A-Z0-9-]{4,12}$/.test(code.toUpperCase())) {
      socket.emit('app-error', 'Enter a valid pairing code (4–12 letters/numbers).'); return;
    }
    const room = code.toUpperCase();
    const existing = io.sockets.adapter.rooms.get(room);
    if (existing && existing.size >= 2) {
      socket.emit('app-error', 'This room already has two connected devices. Create a new code.'); return;
    }
    socket.data.room = room;
    socket.data.deviceName = String(deviceName || 'Nearby device').slice(0, 48);
    socket.join(room);
    socket.emit('joined-room', { code: room, peers: existing ? existing.size : 0 });
    socket.to(room).emit('peer-joined', { deviceName: socket.data.deviceName });
  });
  for (const event of ['webrtc-offer', 'webrtc-answer', 'webrtc-ice', 'transfer-notice']) {
    socket.on(event, payload => {
      const room = socket.data.room;
      if (room) socket.to(room).emit(event, payload);
    });
  }
  socket.on('disconnect', () => {
    if (socket.data.room) socket.to(socket.data.room).emit('peer-left');
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`Mera Gallery running at http://localhost:${PORT}`));
