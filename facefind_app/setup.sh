#!/bin/bash
# FaceFind Local Setup Script
# Run this once to install all dependencies

set -e

echo "🚀 FaceFind Setup Starting..."
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required. Install from https://nodejs.org"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 required. Install from https://python.org"; exit 1; }
command -v mongod >/dev/null 2>&1 || { echo "⚠️  MongoDB not found. Install from https://mongodb.com or run via Docker: docker run -d -p 27017:27017 mongo:6"; }

echo "✅ Prerequisites checked"
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# ML service setup
echo "🐍 Setting up Python ML service..."
cd ml-service
python3 -m pip install -r requirements.txt
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 To run the project, open 3 terminal windows:"
echo ""
echo "  Terminal 1 - Backend:"
echo "    cd backend && npm run dev"
echo ""
echo "  Terminal 2 - ML Service:"
echo "    cd ml-service && uvicorn main:app --reload --port 8000"
echo ""
echo "  Terminal 3 - Frontend:"
echo "    cd frontend && npm start"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo "📊 Admin:     http://localhost:3000/admin"
echo "🤖 ML API:    http://localhost:8000/docs"
