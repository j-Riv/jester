const express = require('express');
const path = require("path");
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const app = express();
const server = require('http').createServer(app);
const routes = require('./routes/authRoutes');

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// App Setup
app.use(morgan('combined'));
app.use(cors());

// Define API routes here
routes(app);

// DB Setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/project_3', { useNewUrlParser: true });

// Send every other request to the React app
// Define any API routes before this runs
require('./routes/profileroute')(app);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});