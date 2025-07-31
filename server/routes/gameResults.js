const express = require('express');
const GameResult = require('../models/GameResult');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/games
// @desc    Save a game result
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { result, opponent, gameBoard, moves, duration } = req.body;

    // Validate required fields
    if (!result || !gameBoard || moves === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: result, gameBoard, and moves are required' 
      });
    }

    // Validate result enum
    if (!['win', 'lose', 'draw'].includes(result)) {
      return res.status(400).json({ 
        message: 'Result must be one of: win, lose, draw' 
      });
    }

    // Create new game result
    const gameResult = new GameResult({
      player: req.user._id,
      playerUsername: req.user.username,
      result,
      opponent: opponent || 'Computer',
      gameBoard,
      moves,
      duration: duration || 0
    });

    await gameResult.save();

    res.status(201).json({
      message: 'Game result saved successfully',
      gameResult
    });
  } catch (error) {
    console.error('Save game result error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Server error while saving game result' });
  }
});

// @route   GET /api/games
// @desc    Get all game results for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, result } = req.query;
    
    // Build query
    const query = { player: req.user._id };
    if (result && ['win', 'lose', 'draw'].includes(result)) {
      query.result = result;
    }

    // Execute query with pagination
    const gameResults = await GameResult.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameResult.countDocuments(query);

    res.json({
      gameResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get game results error:', error);
    res.status(500).json({ message: 'Server error while fetching game results' });
  }
});

// @route   GET /api/games/stats
// @desc    Get game statistics for the current user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get aggregated statistics
    const stats = await GameResult.aggregate([
      { $match: { player: userId } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          wins: { $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] } },
          losses: { $sum: { $cond: [{ $eq: ['$result', 'lose'] }, 1, 0] } },
          draws: { $sum: { $cond: [{ $eq: ['$result', 'draw'] }, 1, 0] } },
          averageMoves: { $avg: '$moves' },
          totalPlayTime: { $sum: '$duration' }
        }
      }
    ]);

    const result = stats[0] || {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      averageMoves: 0,
      totalPlayTime: 0
    };

    // Calculate win rate
    result.winRate = result.totalGames > 0 
      ? Math.round((result.wins / result.totalGames) * 100) 
      : 0;

    res.json(result);
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({ message: 'Server error while fetching game statistics' });
  }
});

// @route   DELETE /api/games/:id
// @desc    Delete a specific game result
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const gameResult = await GameResult.findOne({
      _id: req.params.id,
      player: req.user._id
    });

    if (!gameResult) {
      return res.status(404).json({ message: 'Game result not found' });
    }

    await GameResult.findByIdAndDelete(req.params.id);

    res.json({ message: 'Game result deleted successfully' });
  } catch (error) {
    console.error('Delete game result error:', error);
    res.status(500).json({ message: 'Server error while deleting game result' });
  }
});

module.exports = router; 