// Check if there's a winner
export const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningCombination: combination
      };
    }
  }
  return null;
};

// Check if the board is full (draw)
export const isBoardFull = (board) => {
  return board.every(cell => cell !== '');
};

// Get available moves for AI
export const getAvailableMoves = (board) => {
  return board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
};

// Simple AI move (random for now, can be improved with minimax)
export const getAIMove = (board, difficulty = 'easy') => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) return null;

  switch (difficulty) {
    case 'easy':
      return getRandomMove(availableMoves);
    case 'medium':
      return getMediumMove(board, availableMoves);
    case 'hard':
      return getHardMove(board, availableMoves);
    default:
      return getRandomMove(availableMoves);
  }
};

// Random AI move
const getRandomMove = (availableMoves) => {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Medium AI - blocks obvious wins and takes obvious wins
const getMediumMove = (board, availableMoves) => {
  // First, check if AI can win
  for (let move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    if (checkWinner(testBoard)?.winner === 'O') {
      return move;
    }
  }

  // Then, check if AI needs to block player from winning
  for (let move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    if (checkWinner(testBoard)?.winner === 'X') {
      return move;
    }
  }

  // Otherwise, random move
  return getRandomMove(availableMoves);
};

// Hard AI - uses minimax algorithm
const getHardMove = (board, availableMoves) => {
  return minimax(board, 0, true).index;
};

// Minimax algorithm for hard AI
const minimax = (board, depth, isMaximizing) => {
  const winner = checkWinner(board);
  
  if (winner?.winner === 'O') return { score: 10 - depth };
  if (winner?.winner === 'X') return { score: depth - 10 };
  if (isBoardFull(board)) return { score: 0 };

  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];
    
    for (let move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'O';
      const score = minimax(testBoard, depth + 1, false).score;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];
    
    for (let move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'X';
      const score = minimax(testBoard, depth + 1, true).score;
      
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return { score: bestScore, index: bestMove };
  }
};

// Initialize empty board
export const createEmptyBoard = () => {
  return new Array(9).fill('');
};

// Count moves made
export const countMoves = (board) => {
  return board.filter(cell => cell !== '').length;
};

// Determine game result from player's perspective
export const getGameResult = (winner, playerSymbol) => {
  if (!winner) return 'draw';
  return winner === playerSymbol ? 'win' : 'lose';
}; 