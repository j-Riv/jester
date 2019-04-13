const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const gameSchema = new Schema({
  users: [{}],
  current_turn: '',
  images: [{}]
});

// Create the model class
const ModelClass = mongoose.model('game', gameSchema);

// Export the model
module.exports = ModelClass;