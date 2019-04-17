const router = require('express').Router();
const authRoutes = require('./authRoutes');

router.use('/api', authRoutes);

module.exports = router;