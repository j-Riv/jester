const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require("path");
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3001;;
const routes = require('./routes/authRoutes');


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  app.use(express.static("client/public"));
}

// App Setup
app.use(morgan('combined'));
app.use(cors());

// Place this middleware before any other route definitions
// makes io available as req.io in all request handlers
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Define API routes here
routes(app);

// socket for chat
// const socketController = require('./controllers/socket');
// io.on('connection', socketController.respond);
io.on('connection', function(socket) {
  // game
  console.log('a user connected');
  // on join room
  socket.on('create', function(room) {
    console.log('create this:');
    console.log(room);
    socket.join(room);
  });
  // chat
  socket.on('client msg', function (msg) {
    console.log('server got new message id: ' + msg.gameId);
    console.log('user: ' + msg.user);
    console.log('msg: ' + msg.message);
    socket.in(msg.gameId).emit('new chat', msg);
  });
  // disconnect
  socket.on('disconnect', function (response) {
    console.log(response);
    console.log(`${response} has disconnected.`);
    // console.log(`${response.user} has disconnected.`);
    // socket.in(response.id).emit('Remove Users', { user: response.user });
  });
  // user click
  // socket.on('card selected', function (card) {
  //   console.log('server got card');
  //   console.log('card user: ' + card.user);
  //   console.log('card src: ' + card.src);
  // });
});

// DB Setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/project_3', { useNewUrlParser: true });

// Send every other request to the React app
// Define any API routes before this runs
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

// Start the API server
server.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});