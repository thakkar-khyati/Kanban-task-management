#!/bin/bash

echo "🧪 Phase 1 Testing - MERN Stack Kanban Board"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
total_tests=0
passed_tests=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    total_tests=$((total_tests + 1))
    echo -n "🔍 Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        passed_tests=$((passed_tests + 1))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Test MongoDB
run_test "MongoDB Connection" "mongosh --eval 'db.adminCommand(\"ismaster\")'"

# Test Backend Health
run_test "Backend Health Check" "curl -s http://localhost:5000/health"

# Test Backend API
run_test "Backend API Endpoints" "curl -s http://localhost:5000/api"

# Test Frontend
run_test "Frontend Server" "curl -s http://localhost:3000"

# Test Authentication API
run_test "Authentication API" "curl -s -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'"

# Test Boards API (requires authentication)
echo -n "🔍 Testing Boards API (with auth)... "
auth_response=$(curl -s -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"john@example.com","password":"password123"}')
if echo "$auth_response" | grep -q "success.*true"; then
    token=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$token" ]; then
        boards_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:5000/api/boards)
        if echo "$boards_response" | grep -q "success.*true"; then
            echo -e "${GREEN}✅ PASSED${NC}"
            passed_tests=$((passed_tests + 1))
        else
            echo -e "${RED}❌ FAILED${NC}"
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ FAILED${NC}"
fi
total_tests=$((total_tests + 1))

# Test Tasks API
echo -n "🔍 Testing Tasks API (with auth)... "
if [ -n "$token" ]; then
    tasks_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:5000/api/tasks)
    if echo "$tasks_response" | grep -q "success.*true"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        passed_tests=$((passed_tests + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
    fi
else
    echo -e "${RED}❌ FAILED${NC}"
fi
total_tests=$((total_tests + 1))

echo ""
echo "📊 Phase 1 Test Results:"
echo "========================"
echo -e "Total Tests: $total_tests"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"

echo ""
if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Phase 1 is ready for manual testing.${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready to start manual testing:${NC}"
    echo "   1. Start backend: cd backend && npm run dev"
    echo "   2. Start frontend: cd frontend && npm run dev"
    echo "   3. Open browser: http://localhost:3000"
    echo ""
    echo -e "${BLUE}🔑 Demo credentials:${NC}"
    echo "   Email: john@example.com"
    echo "   Password: password123"
    echo ""
    echo -e "${BLUE}📋 Phase 1 Features to Test:${NC}"
    echo "   ✅ User registration and login"
    echo "   ✅ Board creation and management"
    echo "   ✅ Task creation with full details"
    echo "   ✅ Drag-and-drop between columns"
    echo "   ✅ Priority levels and labels"
    echo "   ✅ Due date tracking"
    echo "   ✅ Dark/light mode toggle"
    echo "   ✅ Responsive design"
    echo "   ✅ Real-time updates"
elif [ $passed_tests -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed. Please check the issues above.${NC}"
else
    echo -e "${RED}❌ All tests failed. Please check your setup.${NC}"
fi

echo ""
echo "📝 For detailed setup instructions, see SETUP.md"
