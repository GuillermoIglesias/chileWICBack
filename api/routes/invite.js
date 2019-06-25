const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Evaluation = require('../models/evaluation');

// INVITE a USER.Revisor to PROPOSAL
router.post('/', checkAuth, (req, res, next) => {
    Evaluation.find({ 
            reviser: req.body.reviser, 
            proposal: req.body.proposal 
        })
        .exec()
        .then(evaluation => {
            if (evaluation.length >= 1) {
                return res.status(409).json({
                    message: 'Reviser already in this Proposal'
                });
            } else {
                const evaluation = new Evaluation({
                    _id: mongoose.Types.ObjectId(),
                    reviser: req.body.reviser,
                    proposal: req.body.proposal
                })
                evaluation.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Successfully invited Reviser',
                            created: result,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;