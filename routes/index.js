const router = require('express').Router();
const profileRoute = require('./profileroute');

router.use('/api', profileRoute);

module.exports = router;