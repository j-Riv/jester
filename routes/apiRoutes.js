const api = require('../controllers/apiController');
require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        res.send({ hi: 'there' });
    });
    app.post('/signin', requireSignin, api.signin);
    app.post('/signup', api.signup);
    app.get('/users/current/:token', api.getCurrentUser);
    app.post('/users/update', api.updateUser);
    app.post('/games/new', api.createGame);
    app.get('/games/game/:id', api.getGame);
    app.get('/games/all', api.getAllGames);
    app.post('/games/update/game/:id', api.updateGame);
    app.post('/games/add/users/', api.addUser);
    app.post('/games/remove/users/', api.removeUser);
    app.post('/games/update/cards/', api.updateGameCards);
    app.post('/games/update/winner/', api.updateGameWinner);
    app.post('/games/game/turn/', api.updateCurrentTurn);
}