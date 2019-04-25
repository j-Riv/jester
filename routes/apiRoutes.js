const api = require('../controllers/apiController');
const passport = require('passport');
require('../services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        console.log('authorization');
        console.log(req.headers)
        res.json({ hi: 'there' });
    });
    app.post('/signin', requireSignin, api.signin);
    app.post('/signup', api.signup);
    app.get('/users/current/:token', api.getCurrentUser);
    app.post('/users/update', requireAuth, api.updateUser);
    app.post('/games/new', requireAuth, api.createGame);
    app.get('/games/game/:id', api.getGame);
    app.get('/games/all', api.getAllGames);
    app.post('/games/update/game/:id', requireAuth, api.updateGame);
    app.post('/games/add/users/',  requireAuth,api.addUser);
    app.post('/games/remove/users/', requireAuth, api.removeUser);
    app.post('/games/update/cards/', requireAuth, api.updateGameCards);
    app.post('/games/update/winner/', requireAuth, api.updateGameWinner);
    app.post('/games/game/turn/', requireAuth, api.updateCurrentTurn);
};