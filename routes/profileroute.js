const controller = require('../controllers/profileController');

module.exports = function(app){
    app.get('/find/:id', controller.findUser);
}