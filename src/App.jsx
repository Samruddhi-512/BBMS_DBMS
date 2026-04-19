import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';
import Login from './pages/Login';
import './index.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="container">
        <nav>
          <h1>BBMS.</h1>
          <div className="links">
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/manage">Management</Link>
                <span style={{ color: 'var(--accent)', marginLeft: '1.5rem' }}>
                  Hi, {user.email || 'User'}
                </span>
                <a href="#" onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/manage" element={
            user ? <Management /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
