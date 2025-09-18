#!/bin/bash

echo "🧪 Testing MERN Stack Kanban Board Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_mongodb() {
    echo -n "🔍 Testing MongoDB connection... "
    if mongosh --eval "db.adminCommand('ismaster')" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
        return 0
    else
        echo -e "${RED}❌ MongoDB is not running${NC}"
        echo -e "${YELLOW}   Please start MongoDB: sudo systemctl start mongod${NC}"
        return 1
    fi
}

test_backend() {
    echo -n "🔍 Testing backend server... "
    if curl -s http://localhost:5000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend is not running${NC}"
        echo -e "${YELLOW}   Start backend: cd backend && npm run dev${NC}"
        return 1
    fi
}

test_frontend() {
    echo -n "🔍 Testing frontend server... "
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend is not running${NC}"
        echo -e "${YELLOW}   Start frontend: cd frontend && npm run dev${NC}"
        return 1
    fi
}

test_api() {
    echo -n "🔍 Testing API endpoints... "
    if curl -s http://localhost:5000/api > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ API is not accessible${NC}"
        return 1
    fi
}

# Run tests
echo ""
test_mongodb
test_backend
test_frontend
test_api

echo ""
echo "📊 Test Summary:"
echo "================"

# Count successful tests
success_count=0
total_tests=4

if test_mongodb; then ((success_count++)); fi
if test_backend; then ((success_count++)); fi
if test_frontend; then ((success_count++)); fi
if test_api; then ((success_count++)); fi

echo ""
if [ $success_count -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All tests passed! Your setup is working perfectly.${NC}"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000/api"
    echo ""
    echo "🔑 Demo credentials:"
    echo "   Email: john@example.com"
    echo "   Password: password123"
elif [ $success_count -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the issues above.${NC}"
else
    echo -e "${RED}❌ All tests failed. Please check your setup.${NC}"
fi

echo ""
echo "📝 For detailed setup instructions, see SETUP.md"
