import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { 
  checkWinner, 
  isBoardFull, 
  getAIMove, 
  createEmptyBoard, 
  countMoves, 
  getGameResult 
} from '../utils/gameLogic';

const TicTacToeGame = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null);
  const [winningCombination, setWinningCombination] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'human'
  const [saving, setSaving] = useState(false);

  // Reset game function
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningCombination([]);
    setGameStartTime(Date.now());
  }, []);

  // Save game result to backend
  const saveGameResult = useCallback(async (gameBoard, moves, duration, result) => {
    if (!user) return;

    try {
      setSaving(true);
      await gameAPI.saveGame({
        result,
        opponent: gameMode === 'ai' ? `Computer (${difficulty})` : 'Human',
        gameBoard,
        moves,
        duration: Math.floor(duration / 1000)
      });
    } catch (error) {
      console.error('Failed to save game:', error);
    } finally {
      setSaving(false);
    }
  }, [user, gameMode, difficulty]);

  // Handle cell click
  const handleCellClick = useCallback((index) => {
    if (board[index] !== '' || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check for winner
    const winResult = checkWinner(newBoard);
    if (winResult) {
      setGameStatus('won');
      setWinner(winResult.winner);
      setWinningCombination(winResult.winningCombination);
      
      const duration = Date.now() - gameStartTime;
      const moves = countMoves(newBoard);
      const result = getGameResult(winResult.winner, 'X');
      saveGameResult(newBoard, moves, duration, result);
      return;
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setGameStatus('draw');
      const duration = Date.now() - gameStartTime;
      const moves = countMoves(newBoard);
      saveGameResult(newBoard, moves, duration, 'draw');
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }, [board, gameStatus, currentPlayer, gameStartTime, saveGameResult]);

  // AI move effect
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && gameStatus === 'playing') {
      const timeoutId = setTimeout(() => {
        const aiMove = getAIMove(board, difficulty);
        if (aiMove !== null) {
          handleCellClick(aiMove);
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, gameStatus, gameMode, board, difficulty, handleCellClick]);

  // Cell component
  const Cell = ({ index, value }) => {
    const isWinningCell = winningCombination.includes(index);
    const cellClass = `game-cell ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''} ${isWinningCell ? 'winning' : ''}`;
    
    return (
      <button
        className={cellClass}
        onClick={() => handleCellClick(index)}
        disabled={gameStatus !== 'playing' || value !== ''}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Tic-Tac-Toe</h1>
      
      {/* Game Controls */}
      <div className="game-controls">
        <div className="control-group">
          <label>Mode:</label>
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            disabled={gameStatus === 'playing' && countMoves(board) > 0}
          >
            <option value="ai">vs Computer</option>
            <option value="human">vs Human</option>
          </select>
        </div>
        
        {gameMode === 'ai' && (
          <div className="control-group">
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={gameStatus === 'playing' && countMoves(board) > 0}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}
      </div>

      {/* Game Status */}
      <div className="game-status">
        {gameStatus === 'playing' && (
          <p>
            Current Player: <strong className={currentPlayer === 'X' ? 'x' : 'o'}>
              {currentPlayer} {gameMode === 'ai' && currentPlayer === 'O' ? '(Computer)' : ''}
            </strong>
          </p>
        )}
        {gameStatus === 'won' && (
          <p style={{color: '#16a34a'}}>
            🎉 {winner} wins! {winner === 'X' ? 'You won!' : (gameMode === 'ai' ? 'Computer wins!' : 'Player O wins!')}
          </p>
        )}
        {gameStatus === 'draw' && (
          <p style={{color: '#a16207'}}>
            🤝 It's a draw!
          </p>
        )}
      </div>

      {/* Game Board */}
      <div className="game-board">
        {board.map((cell, index) => (
          <Cell key={index} index={index} value={cell} />
        ))}
      </div>

      {/* Game Actions */}
      <div className="game-actions">
        <button onClick={resetGame} className="btn btn-primary">
          New Game
        </button>
        
        {saving && (
          <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <div className="spinner spinner-sm"></div>
            <span>Saving game...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToeGame; 