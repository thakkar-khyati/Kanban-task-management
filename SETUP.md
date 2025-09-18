# 🚀 MERN Stack Kanban Board - Setup Guide

## ✅ Project Status
Both backend and frontend projects are properly initialized and ready to run!

## 📋 Prerequisites

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (for cloning)

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 2GB free space
- **OS**: Windows, macOS, or Linux

## 🛠️ Installation Steps

### 1. Clone and Setup
```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd Kanban-task-management

# Run the setup script
./setup.sh
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start MongoDB
Choose one of the following methods:

#### Option A: Using MongoDB Service (Recommended)
```bash
# Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB
```

#### Option B: Manual Start
```bash
# Start MongoDB manually
mongod
```

#### Option C: Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"
# or
mongosh --eval "db.adminCommand('ismaster')"
```

## 🚀 Running the Application

### Method 1: Using the Development Script (Recommended)
```bash
# From the project root
./start-dev.sh
```

This script will:
- Check MongoDB status
- Start the backend server
- Seed the database with sample data
- Start the frontend server
- Display access URLs and credentials

### Method 2: Manual Start

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 3 - Database Seeding (Optional)
```bash
cd backend
npm run seed
```

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔑 Demo Credentials

Use these credentials to test the application:

```
Email: john@example.com
Password: password123
```

## 📊 Sample Data

The database seeder creates:
- 2 sample users
- 2 sample boards with different configurations
- 6 sample tasks with various priorities, labels, and due dates
- Sample subtasks and comments

## 🧪 Testing the Setup

### 1. Backend Health Check
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### 2. Frontend Access
Open http://localhost:3000 in your browser. You should see:
- Login page with demo credentials
- Dark/light mode toggle
- Responsive design

### 3. API Endpoints Test
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Test boards endpoint
curl http://localhost:5000/api/boards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
sudo systemctl start mongod
# or
mongod
```

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill the process using the port
```bash
# Find process using port 5000
lsof -ti:5000
# Kill the process
kill -9 $(lsof -ti:5000)
```

#### 3. Frontend Build Errors
```
Error: Failed to load PostCSS config
```
**Solution**: The PostCSS config has been fixed. If you still see this error:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Errors
If you see CORS errors in the browser console, check that:
- Backend is running on port 5000
- Frontend is running on port 3000
- CORS_ORIGIN in backend/.env is set to http://localhost:3000

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Kanban Board
```

## 📝 Development Commands

### Backend Commands
```bash
cd backend

# Development server
npm run dev

# Production server
npm start

# Database seeding
npm run seed

# Run tests
npm test
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 Next Steps

Once everything is running:

1. **Login** with demo credentials
2. **Create a new board** or explore existing ones
3. **Add tasks** and test drag-and-drop functionality
4. **Toggle dark/light mode** to see the theme system
5. **Test responsive design** on different screen sizes

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check that MongoDB is running
4. Review the console logs for error messages
5. Create an issue with detailed error information

## 🎉 Success!

If you can access the application at http://localhost:3000 and see the login page, congratulations! Your MERN Stack Kanban Board is ready for development and testing.

---

**Happy coding! 🚀**
