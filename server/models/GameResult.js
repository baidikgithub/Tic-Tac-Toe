const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playerUsername: {
    type: String,
    required: true
  },
  result: {
    type: String,
    enum: ['win', 'lose', 'draw'],
    required: true
  },
  opponent: {
    type: String,
    default: 'Computer',
    required: true
  },
  gameBoard: {
    type: [String],
    required: true,
    validate: {
      validator: function(board) {
        return board.length === 9;
      },
      message: 'Game board must have exactly 9 positions'
    }
  },
  moves: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  duration: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GameResult', gameResultSchema); 