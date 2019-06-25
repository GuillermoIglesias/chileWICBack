const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const checkAuth = require('../middleware/check-auth');
const generator = require('generate-password');
require('dotenv').config();

const User = require('../models/user');

// SEND new EMAIL
router.post('/invite', checkAuth, (req, res, next) => {
    const _password = generator.generate({
        length: 5,
        numbers: true
    });

    const user = new User({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        rut: req.body.rut,
        password: _password,
        firstname: req.body.firstname,
        lastname1: req.body.lastname1,
        type: req.body.type
    });

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.CLIENT_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    user.save()
        .then(user => {
            console.log(user);

            res.status(201).json({
                message: 'Successfully created user',
                created: user,
            });

            var mailOptions = {
                from: 'ChileWIC <chilewic.xp@gmail.com>',
                to: user.email,
                subject: 'Invitación ChileWIC',
                html: 'Estimado/a ' + user.firstname + ' ' + user.lastname1 + ',<br /><br />' +
                    'Ha sido invitado para participar en el evento ChileWIC que se realizará este 2019. Las indicaciones son las siguientes:<br /><br />' +
                    '<b>Lugar:</b> Universidad de los Andes, Aula Magna, edificio Biblioteca. Mons. Álvaro Portillo 12.455, Las Condes Santiago. <br />' +
                    '<b>Fecha:</b> Viernes 18 de Octubre de 2019 <br /><br />' +
                    'Para entrar al sistema deberá ingresar con la contraseña: <b>' + user.password + '</b> en el siguiente ' +
                    '<a href="https://johnbidwellb.github.io/ChileWicFrontend/">Link</a>.<br /><br />Saluda Atte.<br />Organización ChileWIC'
            }

            transporter.sendMail(mailOptions)
                .then(function (info) {
                    res.status(201).send(info);
                }).catch(function (err) {
                    res.status(400).send(err);
                });

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });

});

// SEND new EMAIL
router.post('/send', checkAuth, (req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.CLIENT_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    var mailOptions = {
        from: 'ChileWic <chilewic.xp@gmail.com>',
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    }

    transporter.sendMail(mailOptions)
        .then(function (info) {
            res.status(201).send(info);
        }).catch(function (err) {
            res.status(400).send(err);
        });
});

module.exports = router;