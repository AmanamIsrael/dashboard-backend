const router = require('express').Router();
const verify = require('./verifyToken');
const user = require('../models/user');

router.get('/', verify, (req, res) => {
    user.find({}).then((users) => {
        // delete vital information
        res.send(users);
        // restructure response
    })
})

module.exports = router;