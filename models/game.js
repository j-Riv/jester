const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const gameSchema = new Schema({
  phrase: { type: String },
  users: [{}],
  current_turn: { type: String },
  images: [],
  messages: [{}],
  username: { type: String },
  user_pic: { type: String },
  game_name: { type: String },
  max_players: { type: Number, default: 5 },
  category: { type: String, default: 'Safe For Work' },
  status: { type: String, default: 'Public' },
  winner: { type: String, default: 'none' },
  winning_card: { type: String, default: ''},
  winner_chosen: { type: Boolean, default: false }
});

// Create the model class
const ModelClass = mongoose.model('game', gameSchema);

// Export the model
module.exports = ModelClass;