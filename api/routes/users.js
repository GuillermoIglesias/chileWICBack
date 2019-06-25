const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

// READ all USER
router.get("/", checkAuth, (req, res, next) => {
    User.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(201).json({
                users: docs
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// READ by ID
router.get('/id/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// READ by TYPE
router.get('/type/:type', checkAuth, (req, res, next) => {
    const type = req.params.type;
    User.find({ type: type })
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;