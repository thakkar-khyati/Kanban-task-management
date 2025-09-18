# 🚀 Quick Start Guide

## ✅ Project Status: READY TO RUN!

Both backend and frontend projects are properly initialized and ready for testing.

## 🎯 Quick Start (3 Steps)

### 1. Start MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Or manually
mongod
```

### 2. Start the Application
```bash
# Option A: Use the development script (recommended)
./start-dev.sh

# Option B: Manual start
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Demo Login**: john@example.com / password123

## 🧪 Test Your Setup
```bash
# Run the test script
./test-setup.sh
```

## 📁 What's Included

### ✅ Backend (Node.js + Express + MongoDB)
- Complete REST API with authentication
- MongoDB models with validation
- JWT authentication system
- Database seeder with sample data
- Environment configuration

### ✅ Frontend (React + TailwindCSS)
- Modern React app with Vite
- Dark/Light mode support
- Kanban-style drag-and-drop interface
- Responsive design
- Authentication pages

### ✅ Features Working
- User registration and login
- Board creation and management
- Task creation with full details
- Drag-and-drop between columns
- Priority and label management
- Due date tracking
- Subtask support
- Dark/light theme toggle

## 🔧 Troubleshooting

### MongoDB Not Running
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill processes using ports 3000 or 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clean and reinstall
npm run clean
npm run install:all
```

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **README.md** - Complete project documentation
- **roadmap.json** - Development roadmap

## 🎉 Success!

If you can access http://localhost:3000 and see the login page, your MERN Stack Kanban Board is ready for development and testing!

---

**Happy coding! 🚀**
