const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const gameSchema = new Schema({
  users: [{}],
  current_turn: { type: String },
  images: [],
  messages: [{}],
  username: { type: String },
  user_pic: { type: String },
  game_name: { type: String },
  max_players: { type: Number, default: 5 },
  category: String,
  status: { type: String, default: 'Open' }
});

// Create the model class
const ModelClass = mongoose.model('game', gameSchema);

// Export the model
module.exports = ModelClass;