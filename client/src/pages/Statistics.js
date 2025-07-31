import React, { useState, useEffect } from 'react';
import { gameAPI } from '../services/api';
import Header from '../components/Header';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await gameAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mt-8">
          <div className="auth-error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalGames === 0) {
    return (
      <div>
        <Header />
        <div className="container mt-8">
          <div className="game-container text-center">
            <h1>Statistics</h1>
            <p>No games played yet. Start playing to see your statistics!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-8">
        <div className="game-container">
          <h1 className="text-center mb-4">Your Statistics</h1>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div className="p-4" style={{backgroundColor: '#f0f9ff', borderRadius: '0.5rem', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#1e40af'}}>{stats.totalGames}</div>
              <div>Total Games</div>
            </div>
            
            <div className="p-4" style={{backgroundColor: '#f0fdf4', borderRadius: '0.5rem', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#166534'}}>{stats.winRate}%</div>
              <div>Win Rate</div>
            </div>
            
            <div className="p-4" style={{backgroundColor: '#fef2f2', borderRadius: '0.5rem', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#991b1b'}}>{stats.wins}</div>
              <div>Wins</div>
            </div>
            
            <div className="p-4" style={{backgroundColor: '#fffbeb', borderRadius: '0.5rem', textAlign: 'center'}}>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#a16207'}}>{stats.draws}</div>
              <div>Draws</div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'}}>
            <div>
              <h3>Game Results</h3>
              <div style={{marginTop: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>Wins:</span>
                  <span>{stats.wins} ({stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0}%)</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>Losses:</span>
                  <span>{stats.losses} ({stats.totalGames > 0 ? Math.round((stats.losses / stats.totalGames) * 100) : 0}%)</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>Draws:</span>
                  <span>{stats.draws} ({stats.totalGames > 0 ? Math.round((stats.draws / stats.totalGames) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Performance</h3>
              <div style={{marginTop: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>Average Moves:</span>
                  <span>{stats.averageMoves ? stats.averageMoves.toFixed(1) : '0'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span>Total Playtime:</span>
                  <span>{Math.floor(stats.totalPlayTime / 60)}m {stats.totalPlayTime % 60}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 