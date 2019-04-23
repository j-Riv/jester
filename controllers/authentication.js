require('dotenv').config();
const jwt = require('jwt-simple');
const User = require('../models/user');
const Game = require('../models/game');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, process.env.PASSPORT_SECRET);
}

exports.signin = (req, res) => {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user), currentUser: req.user });
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' });
    }

    // See if a user with the given email exists
    User.findOne({ email: email }, (err, existingUser) => {
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

        user.save(err => {
            if (err) { return next(err); }
            // Repond to request indicating the user was created
            res.json({ token: tokenForUser(user), currentUser: user });
        });
    });
}

exports.getCurrentUser = (req, res) => {
    const token = req.params.token;
    const decoded = jwt.decode(token, process.env.PASSPORT_SECRET);
    User.findOne({ 
        _id: decoded.sub 
    }).then(result => {
        // build user obj
        const userObj = {
            _id: result._id,
            email: result.email,
            username: result.username,
            picture: result.picture,
            images: [],
            card_selected: false
        };
        res.json({ currentUser: userObj });
    });
}

exports.updateUser = (req, res) => {
    const id = req.body.id;
    const picture = req.body.picture;
    console.log('this is the id: ' + id);
    User.findOneAndUpdate({ 
        _id: id 
    }, { 
        $set: { 
            picture: picture 
        },
        new: true
    }).then(result => {
        res.json({ picture: picture });
    }).catch(error => {
        console.log(error);
    });
}

exports.createGame = (req, res, next) => {
    // create new game
    const game = new Game({
        phrase: null,
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
    game.save((err, newGame) => {
        if (err) { return next(err); }
        // Repond to request indicating the game was created
        // Send new game object back
        req.io.emit('game added', { game: newGame._id });
        res.json({ game: newGame });
    });
}

exports.getGame = (req, res) => {
    const id = req.params.id;
    // get game by id
    Game.findById(id).then(result => {
        res.json({ game: result });
    }).catch(error => {
        console.log(error);
    });
}

exports.getAllGames = (req, res, next) => {
    // get all games for lobby update
    Game.find({}).then(result => {
        // all games currently in db
        res.json({ games: result });
    }).catch(error => {
        console.log(error);
    });
}

exports.updateGame = (req, res) => {
    const id = req.params.id;
    const game = {
        title: req.body.title,
        users: req.body.users
        // other props
    }
    // update game with matching id
    Game.findOneAndUpdate({ 
        _id: id 
    }, { 
        $set: { 
            game 
        } 
    }).then(result => {
        res.json({ updatedGame: result });
    }).catch(error => {
        console.log(error);
    });
}

exports.addUser = (req, res) => {
    const id = req.body.gameId;
    const user = req.body.user;
    const user_id = req.body.userId;
    if (user !== null) {
        // get user data then --->
        // updating game with new user
        console.log('THIS IS THE ID: ' + user_id + ' of the added user');
        User.findOne({ 
            _id: user_id 
        }).then(userData => {
            // build user obj
            const userObj = {
                _id: userData._id,
                username: userData.username,
                picture: userData.picture
            };
            Game.findOneAndUpdate({ 
                _id: id
             }, { 
                 $addToSet: { 
                     'users': { 
                         user: user, 
                         wins: 0, 
                         data: userObj 
                        } 
                    } 
                }, { 
                    new: true
                }).then(result => {
                    req.io.in(id).emit('add user', { user: user, wins: 0, data: userObj });
                    // user has been added
                    console.log('adding user');
                    console.log(result.users);
                    // emit event to clients in lobby
                    req.io.emit('update games');
                    // send user data
                    res.json({ added: { user: user, wins: 0, data: userObj } });
                }).catch(error => {
                    console.log(error);
                });
        }).catch(error => {
            console.log(error);
        });
    }else{
        console.log('User is null do not add');
    }
}

exports.removeUser = (req, res) => {
    const id = req.body.gameId;
    const user = req.body.user;
    const nextUser = req.body.nextUser;
    if (user !== null) {
        console.log(`Removing this user: ${user} Updating game: ${id}`);
        Game.findOneAndUpdate({ 
            _id: id 
        }, { 
            $pull: { 
                'users':  { 
                    user: user 
                } 
            } 
        }, { 
            safe: true, 
            multi: true, 
            new: true 
        }).then(result => {
            // remove user
            console.log('User ' + user + ' has been removed --->');
            console.log(result.users);
            // emit event to clients in game
            req.io.in(id).emit('remove user', { user: user, nextUser: nextUser });
            // update current turn if game is empty
            if(result.users.length < 1) {
                Game.findOneAndUpdate({ 
                    _id: id 
                }, { 
                    $set: { 
                        current_turn: '' 
                    }, 
                    new: true 
                }).then(result => {
                    // updated current turn to empty string once game was empty
                    console.log('updating current turn to empty on server ---->');
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            }
            // update if current_turn (king) has left
            if (result.current_turn === user) {
                Game.findOneAndUpdate({ 
                    _id: id 
                }, { 
                    $set: { 
                        current_turn: nextUser 
                    }, 
                    new: true 
                }).then(result => {
                    // updated current to run with next user
                    console.log('updating current turn to to next ' + nextUser + ' on server ---->');
                    console.log(result);
                }).catch(error => {
                    console.log(error);
                });
            }
            // emit event to clients in lobby
            req.io.emit('update games');
            res.json({ removed: { user: user, nextUser: nextUser } });
        }).catch(error => {
            console.log(error);
        });
    } else {
        console.log('User is null do not remove');
    }
}

exports.updateCurrentTurn = (req, res) => {
    const id = req.body.gameId;
    const user = req.body.user;
    const phrase = req.body.phrase;
    Game.findOneAndUpdate({ 
        _id: id 
    }, { 
        $set: { 
            current_turn: user, 
            phrase: phrase 
        }, 
        new: true 
    }).then(result => {
        // update current turn
        console.log('updating current turn ' + user + ' on server ---->');
        console.log(result);
        res.json({ turn: user, phrase: phrase });
    }).catch(error => {
        console.log(error);
    });
}

exports.updateGameCards = (req, res) => {
    const id = req.body.gameId;
    // update room with card
    req.io.in(id).emit('update cards', req.body);
    res.json({ card: req.body });
}

exports.updateGameWinner = (req, res) => {
    const id = req.body.gameId;
    const user = req.body.user;
    const phrase = req.body.phrase;
    // send the winner to game
    console.log(`Sending game: ${id} this winner: ${user} this is the new prhase: ${phrase}`);
    req.io.in(id).emit('update winner', req.body);
    res.json({ winner: req.body });
}