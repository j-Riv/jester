const model = require('../models/user');

module.exports = {
    findUser: (req, res) => {
        model.user.find({})
            .then(user => {
                console.log("this went to the .then");
                res.json(user)
            })
    }
}