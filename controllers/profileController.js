const model = require('../models/user');

module.exports = {
    findUser: (req, res) => {
        console.log('Find User Route')
        model.findById({ _id: req.params.id })
            .then(user => {
                console.log("this went to the .then");
                res.json(user)
               
            })
    }
}