import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Changed request payload to use 'email' instead of 'username'
      const { data } = await api.post('/auth/login', { email, password });
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>Login to BBMS</h2>
      {error && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email (admin@bbms.com)" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password (admin123)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        Demo Credentials: admin@bbms.com / admin123
      </p>
    </div>
  );
};

export default Login;
