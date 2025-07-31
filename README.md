# Tic-Tac-Toe Full Stack Application

A complete tic-tac-toe game with user authentication, game history, and statistics. Built with React frontend and Node.js/Express backend with MongoDB for data storage.

## Features

### 🎮 Game Features
- **Interactive Tic-Tac-Toe Game**: Play against an AI with three difficulty levels (Easy, Medium, Hard)
- **Smart AI**: Implements minimax algorithm for challenging gameplay
- **Real-time Game State**: Visual feedback for game progress and results
- **Game Timer**: Track how long each game takes

### 👤 User Management
- **User Registration**: Create new accounts with username, email, and password
- **User Authentication**: Secure sign-in with JWT tokens
- **Protected Routes**: Game features only accessible to authenticated users

### 📊 Game Analytics
- **Game History**: View detailed history of all played games with board states
- **Statistics Dashboard**: Track wins, losses, draws, win rate, and playtime
- **Performance Insights**: Get suggestions for improvement based on your play style
- **Achievement Badges**: Unlock achievements based on your performance

### 🎨 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Comprehensive error messages and validation

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for SPA navigation
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Context API**: State management for authentication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling library
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## Project Structure

```
tic-tac-toe/
├── backend/                 # Backend server
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── GameResult.js   # Game result schema
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── gameResults.js  # Game data routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
└── frontend/              # React frontend
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # React context for state
    │   ├── pages/          # Page components
    │   ├── services/       # API service functions
    │   ├── utils/          # Utility functions
    │   └── App.js          # Main app component
    ├── .env               # Frontend environment variables
    └── package.json       # Frontend dependencies
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd tic-tac-toe
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Update `backend/.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/tictactoe
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/tictactoe
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

#### Start MongoDB
Make sure MongoDB is running:
- **Local MongoDB**: `mongod`
- **MongoDB Atlas**: Ensure your cluster is running and connection string is correct

#### Start Backend Server
```bash
npm run dev
# or for production
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
The `frontend/.env` file should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

### 1. Create Account
- Navigate to `http://localhost:3000`
- Click "Create a new account" or go to `/signup`
- Fill in username, email, and password
- Account will be created and you'll be automatically signed in

### 2. Sign In
- Use the sign-in form with your email and password
- You'll be redirected to the game page upon successful authentication

### 3. Play Game
- Choose difficulty level (Easy, Medium, Hard)
- Click on empty squares to make your move (you are X)
- The AI will automatically make its move (O)
- Game results are automatically saved to your history

### 4. View History
- Click "Game History" in the navigation
- See all your past games with board states and results
- Filter by win/lose/draw
- Delete games you no longer want to keep

### 5. View Statistics
- Click "Statistics" to see your performance analytics
- View win rate, total games, average moves, and playtime
- Get personalized insights and achievement badges
- Track your improvement over time

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user info

### Game Results
- `POST /api/games` - Save game result
- `GET /api/games` - Get user's game history (with pagination and filtering)
- `GET /api/games/stats` - Get user's game statistics
- `DELETE /api/games/:id` - Delete specific game

### Health Check
- `GET /api/health` - Server health check

## Game Logic

### AI Difficulty Levels
1. **Easy**: Random moves
2. **Medium**: Blocks player wins and takes obvious wins
3. **Hard**: Uses minimax algorithm for optimal play

### Winning Conditions
- Three in a row (horizontal, vertical, or diagonal)
- Draw when board is full with no winner

### Game State Management
- Real-time board updates
- Turn management
- Game timer
- Result calculation and storage

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Uses React development server
```

### Database Schema

#### User Model
```javascript
{
  username: String (unique, 3-20 chars)
  email: String (unique, valid email)
  password: String (hashed, min 6 chars)
  createdAt: Date
  updatedAt: Date
}
```

#### GameResult Model
```javascript
{
  player: ObjectId (ref: User)
  playerUsername: String
  result: String (win/lose/draw)
  opponent: String (default: "Computer")
  gameBoard: [String] (9 elements)
  moves: Number (0-9)
  duration: Number (seconds)
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Protected Routes**: Authentication required for game features
- **CORS Configuration**: Proper cross-origin request handling

## Deployment

### Backend Deployment
1. Set production environment variables
2. Use process manager like PM2
3. Configure reverse proxy (nginx)
4. Use MongoDB Atlas for production database

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve static files with web server
3. Update `REACT_APP_API_URL` for production API

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **JWT Token Issues**
   - Check JWT_SECRET in backend `.env`
   - Clear localStorage in browser
   - Verify token expiration settings

3. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API URL in `.env`
   - Ensure both servers are running

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team. 