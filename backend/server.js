const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Import models
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease';

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
const connectedUsers = new Map(); // userId -> socketId
const roomUsers = new Map(); // roomId -> Set of userIds

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('No token provided'));
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.username} connected`);
  connectedUsers.set(socket.userId, socket.id);

  // Handle joining a room
  socket.on('join-room', async (roomId) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }

      socket.join(roomId);
      socket.currentRoom = roomId;

      // Add user to room users tracking
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
      }
      roomUsers.get(roomId).add(socket.userId);

      // Broadcast updated user list to room
      const roomUserIds = Array.from(roomUsers.get(roomId));
      const roomUsernames = await User.find({ _id: { $in: roomUserIds } }).select('username');
      io.to(roomId).emit('room-users', roomUsernames.map(u => u.username));

      console.log(`User ${socket.username} joined room ${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  // Handle leaving a room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(socket.userId);
      if (roomUsers.get(roomId).size === 0) {
        roomUsers.delete(roomId);
      }
    }
    socket.currentRoom = null;
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { roomId, content } = data;
      
      if (!socket.currentRoom || socket.currentRoom !== roomId) {
        socket.emit('error', 'Not in this room');
        return;
      }

      // Create and save message
      const message = new Message({
        content: content.trim(),
        sender: socket.userId,
        room: roomId
      });

      await message.save();
      await message.populate('sender', 'username');

      // Broadcast message to room
      const messageData = {
        id: message._id.toString(),
        content: message.content,
        userId: message.sender._id.toString(),
        username: message.sender.username,
        timestamp: message.timestamp
      };

      io.to(roomId).emit('message', messageData);

      // Update room's last message
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: content.substring(0, 100),
        lastActivity: new Date()
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { roomId } = data;
    if (socket.currentRoom === roomId) {
      socket.to(roomId).emit('user-typing', {
        userId: socket.userId,
        username: socket.username
      });
    }
  });

  socket.on('stop-typing', (data) => {
    const { roomId } = data;
    if (socket.currentRoom === roomId) {
      socket.to(roomId).emit('user-stop-typing', {
        userId: socket.userId
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected`);
    connectedUsers.delete(socket.userId);

    // Remove from room users tracking
    if (socket.currentRoom && roomUsers.has(socket.currentRoom)) {
      roomUsers.get(socket.currentRoom).delete(socket.userId);
      if (roomUsers.get(socket.currentRoom).size === 0) {
        roomUsers.delete(socket.currentRoom);
      } else {
        // Broadcast updated user list
        User.find({ _id: { $in: Array.from(roomUsers.get(socket.currentRoom)) } })
          .select('username')
          .then(users => {
            io.to(socket.currentRoom).emit('room-users', users.map(u => u.username));
          });
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});