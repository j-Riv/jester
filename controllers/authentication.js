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
    const game = new Game({
        users: [],
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
        req.io.emit('game added', { game: newGame._id });
        res.json({ game: newGame });
    });
}

exports.getGame = function(req, res, next) {
    const id = req.params.id;
    // get game by id
    Game.findById(id).then(function (result) {
        res.json({ game: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.getAllGames = function(req, res, next) {
    // get all games for lobby update
    Game.find({}).then(function (result) {
        // all games currently in db
        res.json({ games: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.updateGame = function(req, res, next) {
    const id = req.params.id;
    const game = {
        title: req.body.title,
        users: req.body.users
        // other props
    }
    // update game with matching id
    Game.findOneAndUpdate({ _id: id }, { $set: { game } }).then(function (result) {
        res.json({ updatedGame: result });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.addUser = function (req, res, next) {
    const id = req.body.gameId;
    const user = req.body.user;
    if (user !== null) {
        // updating game with new user
        // console.log(`Updating game: ${id} with this user: ${user}`);
        Game.findOneAndUpdate({ _id: id }, { $addToSet: { 'users': { user: user, wins: 0 } } }, { new: true }).then(function (result) {
            req.io.in(id).emit('add user', { user: user, wins: 0 });
            // user has been added
            // console.log('Users have been updated --->');
            console.log(result.users);
            res.json({ added: { user: user, wins: 0 } });
        }).catch(function (error) {
            console.log(error);
        });
    }else{
        console.log('User is null do not add');
    }
}

exports.removeUser = function (req, res, next) {
    const id = req.body.gameId;
    const user = req.body.user;
    const nextUser = req.body.nextUser;
    if (user !== null) {
        console.log(`Removing this user: ${user} Updating game: ${id}`);
        Game.findOneAndUpdate({ _id: id }, { $pull: { 'users':  { user: user } } }, { safe: true, multi: true, new: true }).then(function (result) {
            // remove user
            console.log('User ' + user + ' has been removed --->');
            console.log(result.users);
            req.io.in(id).emit('remove user', { user: user, nextUser: nextUser });
            // update current turn if game is empty
            if(result.users.length < 1) {
                Game.findOneAndUpdate({ _id: id }, { $set: { current_turn: '' }, new: true }).then(function (result) {
                    // updated current turn to empty string once game was empty
                    console.log('updating current turn to empty on server ---->');
                    console.log(result);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            // update if current_turn (king) has left
            if (result.current_turn === user) {
                Game.findOneAndUpdate({ _id: id }, { $set: { current_turn: nextUser }, new: true }).then(function (result) {
                    // updated current to run with next user
                    console.log('updating current turn to to next ' + nextUser + ' on server ---->');
                    console.log(result);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            res.json({ removed: { user: user, nextUser: nextUser } });
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        console.log('User is null do not remove');
    }
}

exports.updateCurrentTurn = function (req, res, next) {
    const id = req.body.gameId;
    const user = req.body.user;
    Game.findOneAndUpdate({ _id: id }, { $set: { current_turn: user }, new: true }).then(function (result) {
        // update current turn
        console.log('updating current turn ' + user + ' on server ---->');
        console.log(result);
        res.json({ turn: user });
    }).catch(function (error) {
        console.log(error);
    });
}

exports.updateGameCards = function (req, res, next) {
    const id = req.body.gameId;
    const user = req.body.user;
    const card = req.body.card;
    // update room with card
    // console.log(`Updating game: ${id} with this card: ${card}`);
    req.io.in(id).emit('update cards', req.body);
    res.json({ card: req.body });
}

exports.updateGameWinner = function (req, res, next) {
    const id = req.body.gameId;
    const user = req.body.user;
    const card = req.body.card;
    // send the winner to game
    // console.log(`Sending game: ${id} this winner: ${card}`);
    req.io.in(id).emit('update winner', req.body);
    res.json({ winner: req.body });
}