import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import AppDetails from './pages/AppDetails';
import { initializeApi } from './config/api';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    initializeApi().then(() => setIsApiReady(true));
  }, []);

  if (!isApiReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f172a',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Connecting to SpaceAn...</h2>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Checking server status</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid var(--glass-border)' } }} />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/app/:id" element={<AppDetails />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
