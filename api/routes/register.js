const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

// REGISTER new USER
router.post('/', (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        rut: req.body.rut,
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname1: req.body.lastname1,
        lastname2: req.body.lastname2,
        institution: req.body.institution,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        phone: req.body.phone,
        type: req.body.type
    });
    user.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Successfully created user',
                created: result,
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

module.exports = router;