# 🚀 MERN Stack Kanban Board

A modern, full-stack Kanban board application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features drag-and-drop task management, multi-user collaboration, real-time updates, and a beautiful responsive UI.

![Kanban Board](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop**: Smooth task and column reordering with @hello-pangea/dnd
- **Multi-User Collaboration**: Share boards with team members
- **Role-Based Permissions**: Owner, Admin, Member, and Viewer roles
- **Real-Time Updates**: Optimistic UI with instant feedback
- **Task Management**: Subtasks, comments, attachments, labels, priorities
- **Board Management**: Create, edit, archive, and delete boards

### 🎨 User Experience
- **Dark Mode**: Complete theme system with persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with TailwindCSS
- **Loading States**: Smooth loading indicators and error handling
- **Toast Notifications**: Real-time feedback for all actions

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive server-side validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Protection against abuse

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - CSS framework
- **@hello-pangea/dnd** - Drag and drop
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- MongoDB 6.0 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp env.template .env
   # Edit .env with your MongoDB connection string and JWT secret
   
   # Frontend environment
   cd ../frontend
   cp env.example .env
   # Edit .env with your API URL
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not already running)
   mongod
   
   # Seed the database (optional)
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start both backend and frontend (from root directory)
   npm run dev
   
   # Or start them separately:
   # Backend (port 5000)
   cd backend && npm run dev
   
   # Frontend (port 3000)
   cd frontend && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
kanban-board/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration files
│   ├── seeds/              # Database seeders
│   └── server.js           # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── docs/                   # Documentation
└── README.md              # This file
```

## 🔧 Configuration

### Backend Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Kanban Board
```

## 📚 API Documentation

Comprehensive API documentation is available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

### Key Endpoints
- **Authentication**: `/api/auth/*`
- **Boards**: `/api/boards/*`
- **Tasks**: `/api/tasks/*`
- **Members**: `/api/boards/:id/members/*`

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run all tests
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy from the backend directory

```bash
cd backend
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend
2. Deploy the dist folder

```bash
cd frontend
npm run build
# Deploy the dist folder to your hosting service
```

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update the MONGODB_URI environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - Drag and drop
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/your-username/kanban-board/issues)
3. Create a new issue with detailed information

## 🎯 Roadmap

See [roadmap.json](roadmap.json) for the complete project roadmap and current status.

### Current Status: 95% Complete
- ✅ Phase 1: Project Setup & Backend Foundation
- ✅ Phase 2: Frontend Foundation & Basic UI
- ✅ Phase 3: Drag & Drop Implementation
- ✅ Phase 4: Advanced Features
- ✅ Phase 5: UI/UX Polish & Optional Features
- 🔄 Phase 6: Testing & Deployment (In Progress)

---

**Made with ❤️ by [Your Name]**