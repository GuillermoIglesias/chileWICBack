const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

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

const Scholarship = require('../models/scholarship');

// UPLOAD new SCHOLARSHIP
router.post('/', checkAuth, upload.array('file', 2), (req, res, next) => {
    const scholarship = new Scholarship({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        reason: req.body.reason,
        cert1: "uploads/" + req.files[0]['filename'],
        cert2: "uploads/" + req.files[1]['filename'],
    });
    scholarship.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Successfully created Scholarship',
                created: result,
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

// READ all SCHOLARSHIP
router.get("/", checkAuth, (req, res, next) => {
    Scholarship.find()
        .select('-__v')
        .populate('user', '-__v')
        .exec()
        .then(docs => {
            res.status(201).json({
                scholarships: docs
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

// UPDATE status 
router.patch("/:id", checkAuth, (req, res, next) => {
    const id = req.params.id;
    Scholarship.update({ _id: id }, {
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
    Scholarship.find({ user: id_user })
        .select('-__v')
        .populate('user', '-__v')
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