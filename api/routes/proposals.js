const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.user + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20 // 100 MByte
    },
    fileFilter: fileFilter
});

const Proposal = require('../models/proposal');

// UPLOAD new PROPOSAL
router.post('/', checkAuth, upload.single('file'), (req, res, next) => {
    const proposal = new Proposal({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        title: req.body.title,
        abstract: req.body.abstract,
        theme: req.body.theme,
        type: req.body.type,
        file: "uploads/" + req.file.filename
    });
    proposal.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Successfully created Proposal',
                created: result,
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

// READ all PROPOSAL
router.get("/", checkAuth, (req, res, next) => {
    Proposal.find()
        .select('-__v')
        .populate('user', '-__v')
        //.populate('evaluation', '-__v')
        .populate({ path: 'evaluation', populate: { path: 'reviser' }})
        .exec()
        .then(docs => {
            res.status(201).json({
                proposals: docs
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// READ by ID
router.get('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Proposal.findById(id)
        .select('-__v')
        .populate('user', '-__v')
        //.populate('evaluation', '-__v')
        .populate({ path: 'evaluation', populate: { path: 'reviser' }})
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

// UPDATE status 
router.patch("/:id", checkAuth, (req, res, next) => {
    const id = req.params.id;
    Proposal.update({ _id: id }, {
        $set: {
            status: req.body.status
        }
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

// READ by ID
router.get('/user/:id_user', checkAuth, (req, res, next) => {
    const id_user = req.params.id_user;
    Proposal.find({ user: id_user })
        .select('-__v')
        .populate('user', '-__v')
        //.populate('evaluation', '-__v')
        .populate({ path: 'evaluation', populate: { path: 'reviser' }})
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