const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const messageSchema = new Schema({
    user: String,
    message: String
});

// Create the model class
const ModelClass = mongoose.model('message', messageSchema);

// Export the model
module.exports = ModelClass;