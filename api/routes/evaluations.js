const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Evaluation = require('../models/evaluation');

// READ all EVALUATIONS
router.get("/", checkAuth, (req, res, next) => {
    Evaluation.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(201).json({
                evaluations: docs
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// READ by PROPOSAL
router.get('/proposal/:proposal', checkAuth, (req, res, next) => {
    Evaluation.find({ proposal: req.params.proposal })
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

// READ by REVISER
router.get('/reviser/:reviser', checkAuth, (req, res, next) => {
    Evaluation.find({ reviser: req.params.reviser })
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

// UPDATE Evaluation
router.patch('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Evaluation.update({ _id: id }, {
        $set: req.body
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;