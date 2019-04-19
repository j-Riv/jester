const Authentication = require('../controllers/authentication');
require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res) {
        res.send({ hi: 'there' });
    });
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.get('/users/current/:token', Authentication.getCurrentUser);
    app.post('/users/update', Authentication.updateUser);
    app.post('/games/new', Authentication.createGame);
    app.get('/games/game/:id', Authentication.getGame);
    app.get('/games/all', Authentication.getAllGames);
    app.post('/games/update/game/:id', Authentication.updateGame);
    app.post('/games/add/users/', Authentication.addUser);
    app.post('/games/remove/users/', Authentication.removeUser);
    app.post('/games/update/cards/', Authentication.updateGameCards);
    app.post('/games/update/winner/', Authentication.updateGameWinner);
    app.post('/games/game/turn/', Authentication.updateCurrentTurn);
}