# Distracto - MERN Stack Productivity App

A full-stack productivity application built with MongoDB, Express.js, React, and Node.js to help users manage their time, reduce distractions, and optimize their daily routines.

## Features

- **User Authentication**: Secure registration and login system
- **Screen Time Analytics**: Track and analyze digital habits
- **Website Blocking**: Block distracting websites during focus periods
- **AI-Powered Timetable Generation**: Create personalized schedules using AI
- **Social Features**: Connect with friends and compare productivity
- **Real-time Chat**: Messaging system with Socket.io
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Socket.io Client** - Real-time updates

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd distracto
   ```

2. **Install dependencies for both client and server**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Server (.env in /server directory):**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/distracto
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:8080
   ```
   
   **Client (.env in root directory):**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB locally:
   ```bash
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run start:full
   ```
   
   This will start both the backend server (port 5000) and frontend development server (port 8080).

### Alternative: Start servers separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `POST /api/users/follow/:userId` - Follow user
- `DELETE /api/users/follow/:userId` - Unfollow user

### Screen Time
- `GET /api/screen-time/:date?` - Get screen time data
- `PUT /api/screen-time/:date?` - Update screen time data
- `GET /api/screen-time/weekly/:startDate` - Get weekly data

### Website Blocker
- `GET /api/website-blocker` - Get blocked sites
- `POST /api/website-blocker` - Add blocked site
- `PUT /api/website-blocker/:id` - Update blocked site
- `DELETE /api/website-blocker/:id` - Delete blocked site

### Timetables
- `GET /api/timetable` - Get timetables
- `POST /api/timetable` - Create timetable
- `PUT /api/timetable/:id` - Update timetable
- `DELETE /api/timetable/:id` - Delete timetable

### Social
- `GET /api/social/chats` - Get user chats
- `POST /api/social/chats` - Create new chat
- `POST /api/social/chats/:chatId/messages` - Send message
- `GET /api/social/followers` - Get followers
- `GET /api/social/following` - Get following

### AI
- `POST /api/ai/chat` - AI chat endpoint
- `POST /api/ai/timetable` - Generate AI timetable

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  displayName: String (required),
  photoURL: String,
  preferences: {
    goal: String,
    occupation: String,
    college: String,
    interests: [String],
    distractoId: String (unique)
  },
  followers: [ObjectId],
  following: [ObjectId],
  isBot: Boolean,
  botType: String,
  lastActive: Date,
  isOnline: Boolean
}
```

### Screen Time Model
```javascript
{
  userId: ObjectId (required),
  date: Date (required),
  totalTime: Number,
  productiveTime: Number,
  unproductiveTime: Number,
  topSites: [AppUsage],
  deviceData: [DeviceUsage],
  extensionData: Mixed
}
```

### Blocked Site Model
```javascript
{
  userId: ObjectId (required),
  url: String (required),
  isActive: Boolean,
  blockType: String (enum: ['always', 'scheduled']),
  scheduleStart: String,
  scheduleEnd: String,
  blockedCount: Number
}
```

## Development

### Project Structure
```
distracto/
├── server/                 # Backend code
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Database scripts
│   └── server.js          # Main server file
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
└── package.json          # Client dependencies
```

### Available Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Server:**
- `npm run server` - Start backend development server
- `npm run server:install` - Install server dependencies

**Combined:**
- `npm run start:full` - Start both client and server
- `npm run install:all` - Install all dependencies

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Set environment variables in your hosting platform
4. Update CORS settings for your frontend domain

### Frontend Deployment
1. Update `VITE_API_URL` to point to your deployed backend
2. Build the project: `npm run build`
3. Deploy the `dist` folder to platforms like Netlify, Vercel, or Surge

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.