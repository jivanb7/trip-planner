#!/bin/bash
# Trip Planner — Start backend + frontend in one command
# Usage: ./start.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting AI Trip Planner..."
echo ""

# Start backend in background
echo "▸ Starting backend (FastAPI) on http://localhost:8000..."
cd "$PROJECT_DIR/backend"
conda run -n ml uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start frontend in background
echo "▸ Starting frontend (Vite) on http://localhost:5173..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "   Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "Done."
}
trap cleanup INT TERM

# Wait for either to exit
wait
