# MindEase Chat Platform - Complete Setup Guide

A full-stack mental wellness chat platform with real-time messaging, user authentication, and room-based discussions.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database - Choose one option:

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/mindease

# Option B: MongoDB Atlas (recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindease?retryWrites=true&w=majority

# JWT Configuration (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
SESSION_SECRET=your-session-secret-key-also-change-this
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# On macOS with Homebrew:
brew install mongodb/brew/mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Or manually:
mongod --config /usr/local/etc/mongod.conf
```

#### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Replace `MONGODB_URI` in `.env` with your connection string

### 5. Start the Backend

```bash
# From the backend directory
npm run dev
```

Backend will be available at: `http://localhost:3001`

### 6. Start Both Servers

Open two terminal windows:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

## ✅ Verification

1. **Frontend**: Visit `http://localhost:5173` - you should see the login page
2. **Backend**: Visit `http://localhost:3001/api/health` - should return `{"status":"ok"}`
3. **Create an account** using the sign-up form
4. **Join a chat room** from the Community page
5. **Send messages** and see real-time updates

## 🔧 Features Included

### Authentication System
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Automatic redirect after login
- ✅ Sign out functionality

### Real-time Chat System
- ✅ Socket.io integration
- ✅ Room-based messaging
- ✅ Online user tracking
- ✅ Typing indicators
- ✅ Message history
- ✅ User presence

### Backend API
- ✅ RESTful API endpoints
- ✅ MongoDB integration
- ✅ Input validation
- ✅ Error handling
- ✅ Security middleware
- ✅ Rate limiting

### Frontend Features
- ✅ Modern React with TypeScript
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states
- ✅ Route protection

## 📁 Project Structure

```
mindease/
├── src/                          # Frontend React app
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx     # Login/Register form
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   ├── chat/
│   │   │   └── ChatRoom.tsx      # Chat room component
│   │   └── layout/
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── hooks/
│   │   └── useSocket.ts          # Socket.io hook
│   ├── pages/
│   │   └── Community.tsx         # Chat rooms listing
│   └── App.tsx                   # Main app with routing
├── backend/                      # Backend Node.js server
│   ├── models/                   # MongoDB models
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Message.js
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication endpoints
│   │   └── rooms.js              # Room management
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   ├── server.js                 # Main server file
│   └── .env                      # Environment variables
└── SETUP.md                      # This setup guide
```

## 🐛 Troubleshooting

### Common Issues

**1. "ECONNREFUSED" error**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`

**2. "JWT Secret not provided"**
- Ensure `JWT_SECRET` is set in `backend/.env`
- Make sure the secret is long and random

**3. Frontend can't connect to backend**
- Verify backend is running on port 3001
- Check `CLIENT_URL` in backend `.env`
- Ensure no firewall is blocking the ports

**4. Socket connection issues**
- Check browser console for WebSocket errors
- Verify CORS settings in `server.js`
- Ensure authentication token is being sent

**5. Database connection failed**
- Local MongoDB: Check if `mongod` service is running
- Atlas: Verify connection string and network access

### Debug Commands

```bash
# Check if ports are in use
lsof -i :3001  # Backend port
lsof -i :5173  # Frontend port

# Test backend health
curl http://localhost:3001/api/health

# Check MongoDB connection (local)
mongo mongodb://localhost:27017/mindease

# View backend logs
cd backend && npm run dev

# View frontend in development mode
npm run dev
```

## 🔒 Security Notes

### For Development
- Default JWT secrets are provided for development
- CORS is configured for localhost

### For Production
1. **Change all secrets** in `.env`
2. **Use HTTPS** for both frontend and backend
3. **Configure proper CORS** origins
4. **Use environment variables** for all sensitive data
5. **Enable MongoDB authentication**
6. **Use a process manager** like PM2
7. **Set up proper logging**

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/verify` | Verify JWT token |
| POST | `/api/auth/logout` | User logout |

### Room Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all public rooms |
| GET | `/api/rooms/:id` | Get room details |
| GET | `/api/rooms/:id/messages` | Get room messages |
| POST | `/api/rooms/:id/join` | Join a room |
| POST | `/api/rooms/:id/leave` | Leave a room |

### Socket Events

**Client to Server:**
- `join-room` - Join a chat room
- `send-message` - Send message
- `typing` - Start typing indicator
- `stop-typing` - Stop typing indicator

**Server to Client:**
- `message` - New message received
- `room-users` - Updated user list
- `user-typing` - User typing indicator
- `user-stop-typing` - Stop typing indicator

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Configure redirects for SPA

### Backend (Railway/Render/DigitalOcean)
1. Set environment variables
2. Install dependencies: `npm install`
3. Start: `npm start`

### Database
- Use MongoDB Atlas for production
- Enable authentication and network restrictions

---

## 🎉 Success!

If you can register an account, join a chat room, and send messages in real-time, everything is working perfectly!

For questions or issues, check the troubleshooting section above.