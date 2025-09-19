#!/bin/bash

# Deployment script for MERN Stack Kanban Board
# This script handles deployment to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Dependencies check passed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm ci --only=production
    cd ..
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm ci
    cd ..
    
    print_status "Dependencies installed successfully!"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    print_status "Frontend built successfully!"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    npm test
    cd ..
    
    print_status "All tests passed!"
}

# Docker deployment
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Build and start containers
    docker-compose up -d --build
    
    print_status "Docker deployment completed!"
    print_status "Application is running at:"
    print_status "  Frontend: http://localhost:3000"
    print_status "  Backend: http://localhost:5000"
    print_status "  MongoDB: mongodb://localhost:27017"
}

# Production deployment
deploy_production() {
    print_status "Deploying to production..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build frontend
    build_frontend
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend (if using a simple server)
    print_status "Starting frontend server..."
    cd frontend
    npx serve -s dist -l 3000 &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Production deployment completed!"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Frontend PID: $FRONTEND_PID"
}

# Clean up
cleanup() {
    print_status "Cleaning up..."
    
    # Stop Docker containers
    docker-compose down
    
    # Remove node_modules
    rm -rf backend/node_modules
    rm -rf frontend/node_modules
    rm -rf frontend/dist
    
    print_status "Cleanup completed!"
}

# Main function
main() {
    case "${1:-help}" in
        "docker")
            check_dependencies
            deploy_docker
            ;;
        "production")
            check_dependencies
            deploy_production
            ;;
        "test")
            check_dependencies
            run_tests
            ;;
        "build")
            check_dependencies
            install_dependencies
            build_frontend
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            echo "Usage: $0 {docker|production|test|build|cleanup|help}"
            echo ""
            echo "Commands:"
            echo "  docker      Deploy using Docker Compose"
            echo "  production  Deploy to production (manual)"
            echo "  test        Run all tests"
            echo "  build       Build the application"
            echo "  cleanup     Clean up build artifacts"
            echo "  help        Show this help message"
            ;;
    esac
}

# Run main function
main "$@"
