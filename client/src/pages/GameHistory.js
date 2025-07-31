import React from 'react';
import Header from '../components/Header';

const GameHistory = () => {
  return (
    <div>
      <Header />
      <div className="container mt-8">
        <div className="game-container text-center">
          <h1>Game History</h1>
          <p>Game history feature has been simplified. Check your statistics instead!</p>
          <button 
            onClick={() => window.location.href = '/stats'} 
            className="btn btn-primary mt-4"
          >
            View Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHistory; 