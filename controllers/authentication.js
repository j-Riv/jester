require('dotenv').config();
const axios = require('axios');
const jwt = require('jwt-simple');
const User = require('../models/user');
const Game = require('../models/game');
// const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, process.env.PASSPORT_SECRET);
}

exports.signin = function (req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user), currentUser: req.user });
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    // See if a user with the given email exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) { return next(err); }

        // If a user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

        // If a user with email does NOT exist, create and save user record
        const user = new User({
            email: email,
            password: password,
            username: username
        });

        user.save(function (err) {
            if (err) { return next(err); }

            // Repond to request indicating the user was created
            res.json({ token: tokenForUser(user), currentUser: user });
        });
    });
}

exports.getCurrentUser = function (req, res, next) {
    const token = req.params.token;
    const decoded = jwt.decode(token, process.env.PASSPORT_SECRET);
    User.findOne({ _id: decoded.sub }).then(function (result) {
        res.json({ currentUser: result });
    });
}

exports.update = function (req, res, next) {
    const id = req.body.id;
    const username = req.body.username;
    const picture = req.body.picture;
    console.log('this is the id: ' + id);
    console.log('this is the username: ' + username);
    User.findOneAndUpdate({ _id: id }, { $set: { username: username, picture: picture }
    }).then(function (result) {
        res.json({ currentUser: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.createGame = function (req, res, next) {
    // create new game
    // need to update with form inputs
    const game = new Game({
        users: [req.body.username],
        current_turn: req.body.current_turn,
        images: [],
        messages: [],
        username: req.body.username,
        user_pic: req.body.user_pic,
        game_name: req.body.game_name,
        category: req.body.game_category,
        status: req.body.game_status
    });
    game.save(function(err, newGame) {
        if (err) { return next(err); }
        // Repond to request indicating the game was created
        // Send new game object back
        res.json({ game: newGame });
    });
}

exports.getGame = function(req, res, next) {
    const id = req.params.id;
    console.log('this is the id of the game we are looking for:');
    console.log(id);
    Game.findById(id).then(function (result) {
        res.json({ game: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.getAllGames = function(req, res, next) {
    console.log('getting all games for lobby update:');
    Game.find({}).then(function (result) {
        console.log(result)
        res.json({ games: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.updateGame = function(req, res, next) {
    const id = req.params.id;
    const game = {
        title: req.body.title,
        users: req.body.users,
        // other props
    }
    // might be easeier to just send req.body as
    // { title: 'the title', users: [user1, user2, user3 ] }
    console.log('updating game with id: ' + id);
    Game.findOneAndUpdate({ _id: id }, { $set: { game } }).then(function (result) {
        res.json({ updatedGame: result });
    }).catch(function (error) {
        console.log(error);
    });
}