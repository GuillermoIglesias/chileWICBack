const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const User = require('../api/models/user');

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
        .catch(e => { console.error(e.message); });

var users = require('./users-data.json');

for (i = 0; i < users.length; i++) {
 
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        rut: users[i]['rut'],
        email: users[i]['email'],
        password: users[i]['password'],
        firstname: users[i]['firstname'],
        lastname1: users[i]['lastname1'],
        lastname2: users[i]['lastname2'],
        institution: users[i]['institution'],
        birthdate: users[i]['birthdate'],
        gender: users[i]['gender'],
        phone: users[i]['phone'],
        type: users[i]['type']
    });

    user.save()
        .then(result => { console.log(result) })
        .catch(err => { console.log(err) });
}