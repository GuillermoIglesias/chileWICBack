const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

// LOGIN
router.post('/',(req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (req.body.password == user.password) {
                const token = jwt.sign(
                    { user },
                    process.env.JWTKEY,
                    { expiresIn: "90d" }
                );
                return res.status(200).json({
                    message: 'Successful Authentication',
                    token: token,
                    login: true
                })
            }
            else {
                return res.status(401).json({
                    message: 'Incorrect Email and/or Password',
                    login: false
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;