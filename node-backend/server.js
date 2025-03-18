// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const corsOptions = require('./corsOptions');
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Array to store used RFIDs
const usedRFIDs = [];

const PORT = process.env.PORT || 6003;
const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: '*'
  });

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room based on routeId
  socket.on('joinRoom', (routeId) => {
    socket.join(routeId);
    console.log(`User ${socket.id} joined room ${routeId}`);
    socket.emit('joined', { id: socket.id, room: routeId });
  });

  // Handle delivery start and broadcast coordinates to the room
  socket.on('startDelivery', (data) => {
    const { routeId, coordinates } = data;
    io.to(routeId).emit('deliveryStarted', { routeId, coordinates });
  });

  // Handle location updates and broadcast to the room
  socket.on('locationUpdate', (data) => {
    const { routeId, coordinate, position } = data;
    io.to(routeId).emit('locationUpdate', { routeId, coordinate, position });
  });

  // Handle RFID verification and broadcast result to the room
  socket.on('verifyRFID', (data) => {
    const { routeId, rfid, expectedRFID } = data;
    let status;

    if (usedRFIDs.includes(rfid)) {
      status = 'fraud-detected';
    } else if (rfid === expectedRFID) {
      status = 'verified';
      usedRFIDs.push(rfid); // Add to used RFIDs array
    } else {
      status = 'invalid';
    }

    console.log(`RFID Verification: ${rfid}, Status: ${status}, Used RFIDs: ${usedRFIDs}`);
    io.to(routeId).emit('rfidVerified', { routeId, status });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

