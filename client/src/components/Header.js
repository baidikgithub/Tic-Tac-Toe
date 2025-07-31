import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/game" className="logo">
          🎮 Tic-Tac-Toe
        </Link>
        
        <nav className="nav">
          <Link to="/game" className="nav-link">Game</Link>
          <Link to="/history" className="nav-link">History</Link>
          <Link to="/stats" className="nav-link">Statistics</Link>
        </nav>

        <div className="user-section">
          {user && (
            <span>Welcome, <strong>{user.username}</strong></span>
          )}
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 