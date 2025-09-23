# MindEase Backend

A complete backend API for the MindEase mental wellness chat platform built with Node.js, Express, Socket.io, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 💬 **Real-time Chat** - Socket.io powered messaging system
- 🏠 **Room Management** - Create and join chat rooms
- 👥 **User Management** - Profile management and user presence
- 🔒 **Security** - Rate limiting, CORS, and input validation
- 📝 **Message History** - Persistent chat messages with MongoDB
- 🎯 **Typing Indicators** - Real-time typing status
- 👤 **Online Status** - Track active users in rooms

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi
- **Password Hashing:** bcryptjs

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and setup:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/mindease
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-session-secret-key
   ```

3. **Start MongoDB:**
   - **Local MongoDB:** `mongod`
   - **MongoDB Atlas:** Use your connection string in `MONGODB_URI`

4. **Seed the database (Optional):**
   ```bash
   npm run seed
   ```
   This will create:
   - Admin user: `admin@mindease.com` / `admin123`
   - 5 demo users: `user1@example.com` / `password123` (user1-user5)
   - 6 default chat rooms with sample messages

5. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Server will be running on:** `http://localhost:3001`
   - Health check: `http://localhost:3001/api/health`
   - WebSocket endpoint ready for frontend connections

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/verify` | Verify JWT token | Private |
| POST | `/logout` | User logout | Private |
| PUT | `/profile` | Update profile | Private |
| DELETE | `/account` | Deactivate account | Private |

### Room Routes (`/api/rooms`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all public rooms | Private |
| GET | `/:id` | Get room details | Private |
| GET | `/:id/messages` | Get room messages | Private |
| POST | `/` | Create new room | Private |
| POST | `/:id/join` | Join a room | Private |
| POST | `/:id/leave` | Leave a room | Private |
| GET | `/user/joined` | Get user's rooms | Private |
| PUT | `/:id` | Update room | Moderator |
| DELETE | `/:id` | Delete room | Creator |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## Socket Events

### Client to Server Events

- `join-room` - Join a chat room
- `leave-room` - Leave a chat room  
- `send-message` - Send a message to room
- `typing` - Indicate user is typing
- `stop-typing` - Stop typing indicator

### Server to Client Events

- `message` - New message received
- `room-users` - Updated list of online users
- `user-typing` - User started typing
- `user-stop-typing` - User stopped typing
- `error` - Error message

## Database Models

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  isActive: Boolean,
  lastSeen: Date,
  preferences: {
    notifications: Boolean,
    privateMode: Boolean
  }
}
```

### Room Model
```javascript
{
  name: String,
  description: String,
  category: String,
  isPublic: Boolean,
  maxMembers: Number,
  members: [ObjectId],
  moderators: [ObjectId],
  creator: ObjectId,
  lastMessage: String,
  lastActivity: Date,
  rules: [String],
  tags: [String]
}
```

### Message Model
```javascript
{
  content: String,
  sender: ObjectId,
  room: ObjectId,
  timestamp: Date,
  edited: Boolean,
  editedAt: Date,
  messageType: String,
  reactions: [Object]
}
```

## Development

### Project Structure
```
backend/
├── server.js              # Main server file
├── models/                 # Mongoose models
│   ├── User.js
│   ├── Room.js
│   └── Message.js
├── routes/                 # API routes
│   ├── auth.js
│   └── rooms.js
├── middleware/             # Custom middleware
│   └── auth.js
├── seeds/                  # Database seeding
│   └── seedData.js
├── package.json
├── .env                    # Environment configuration
├── .env.example           # Environment template
└── README.md
```

### Adding New Features

1. **New Routes:** Add to `routes/` directory
2. **New Models:** Add to `models/` directory  
3. **Middleware:** Add to `middleware/` directory
4. **Socket Events:** Add to `server.js` socket handling

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/mindease |
| `JWT_SECRET` | JWT signing secret | (required) |
| `SESSION_SECRET` | Session secret | (required) |

## Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcryptjs with salt rounds
- **Rate Limiting** to prevent abuse
- **CORS** configuration for cross-origin requests
- **Helmet** for security headers
- **Input Validation** using Joi schemas
- **MongoDB Injection** protection via Mongoose

## Deployment

### Production Considerations

1. **Environment Variables:** Set production values in `.env`
2. **MongoDB:** Use MongoDB Atlas or secured MongoDB instance
3. **JWT Secret:** Use a strong, random secret key
4. **Process Manager:** Use PM2 or similar for production
5. **Reverse Proxy:** Use Nginx for SSL and load balancing
6. **Monitoring:** Add logging and monitoring solutions

### Example PM2 Configuration
```json
{
  "name": "mindease-backend",
  "script": "server.js",
  "instances": "max",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3001
  }
}
```

## Testing

### Quick Test Commands

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test login (use response token for authenticated requests)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}'

# Test getting rooms (replace TOKEN with actual JWT token)
curl -X GET http://localhost:3001/api/rooms \
  -H "Authorization: Bearer TOKEN"
```

### Using Seeded Data

After running `npm run seed`, you can immediately test with:
- **Admin login:** `admin@mindease.com` / `admin123`
- **Demo users:** `user1@example.com` / `password123` (through user5)
- **Chat rooms:** 6 pre-created rooms with different categories
- **Sample messages:** Each room has sample conversations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - Verify network connectivity for Atlas

2. **JWT Token Errors:**
   - Check `JWT_SECRET` is set in `.env`
   - Verify token format in requests

3. **CORS Issues:**
   - Verify `CLIENT_URL` matches frontend URL
   - Check CORS configuration in `server.js`

4. **Socket Connection Issues:**
   - Ensure frontend Socket.io client version compatibility
   - Check authentication token in socket handshake

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.