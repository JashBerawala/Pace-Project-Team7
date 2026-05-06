import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import EventManage from './pages/EventManage';
import GuestPage from './pages/GuestPage';
import ResultsPage from './pages/ResultsPage';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/event/:id" element={
          <ProtectedRoute>
            <EventManage />
          </ProtectedRoute>
        } />
        <Route path="/guest/:eventCode" element={<GuestPage />} />
        <Route path="/results/:eventCode" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
