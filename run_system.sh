#!/bin/bash

# Hospital Appointment System - Run Script
# This script starts both backend and frontend servers

echo "🏥 Starting Hospital Appointment System..."
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Backend virtual environment exists
if [ ! -d "Backend/venv" ]; then
    echo -e "${RED}❌ Backend virtual environment not found!${NC}"
    echo "Please run setup first or create venv manually:"
    echo "  cd Backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if Frontend node_modules exists
if [ ! -d "Frontend/node_modules" ]; then
    echo -e "${RED}❌ Frontend dependencies not installed!${NC}"
    echo "Please run: cd Frontend && npm install"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Backend Server
echo -e "${YELLOW}🔧 Starting Backend Server...${NC}"
cd Backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend running on http://localhost:8000${NC}"
echo -e "${GREEN}📚 API Docs: http://localhost:8000/docs${NC}"

# Start Frontend Server
echo -e "${YELLOW}🎨 Starting Frontend Server...${NC}"
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Frontend failed to start!${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Frontend running on http://localhost:5173${NC}"
echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}🎉 System is ready!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
