#!/bin/bash

echo "🚀 Starting MERN Stack Kanban Board Development Environment"
echo "=========================================================="

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   mongod"
    echo ""
    read -p "Press Enter to continue anyway (backend will fail to connect)..."
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
}

# Function to seed database
seed_database() {
    echo "🌱 Seeding database with sample data..."
    cd backend
    npm run seed
    cd ..
}

# Start backend
start_backend

# Wait a moment for backend to start
sleep 3

# Seed database
seed_database

# Start frontend
start_frontend

echo ""
echo "✅ Development environment started!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Health Check: http://localhost:5000/health"
echo ""
echo "🔑 Demo credentials:"
echo "   Email: john@example.com"
echo "   Password: password123"
echo ""
echo "📝 To stop the servers:"
echo "   Press Ctrl+C or run: pkill -f 'npm run dev'"
echo ""

# Wait for user input to stop
read -p "Press Enter to stop all servers..."

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
pkill -f 'npm run dev' 2>/dev/null

echo "✅ Servers stopped successfully!"
