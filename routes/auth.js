const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

// User Register
router.post('/register', async(req, res) => {
    //validate data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already exists
    const emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('Email already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    //save the user
    try {
        const savedUser = await user.save();
        res.send({
            msg: 'user created',
            UserId: user._id,
            name: user.name
        });
    } catch (err) {
        console.log('catch');
        res.status(400).json(err);
    }
});

// User Login
router.post('/login', async(req, res) => {
    // validate data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check if user already exists
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Email is wrong');
    }
    //check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('password is wrong');
    }
    //assign token
    const token = jwt.sign({ id: user._id, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, process.env.TOKEN_SECRET);
    res.header('auth-token', token);

    res.send({
        msg: 'user logged in',
        userId: user._id,
        token: token
    })

});

module.exports = router;