const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true },
    rut: { type: Number, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname1: { type: String, required: true },
    lastname2: { type: String, default: '' },
    institution: { type: String, default: '' },
    program: { type: String, default: '' },
    birthdate: { type: Date, default: '' },
    gender: { type: String, default: '' },
    phone: { type: Number, default: '' },
    type: { 
        type: String, 
        required: true,
        enum: ['committee', 
            'general-chair', 
            'organization-chair', 
            'reviser', 
            'student', 
            'professional', 
            'assistant',
            'sponsor'
        ]
    }
});

module.exports = mongoose.model('User', userSchema);