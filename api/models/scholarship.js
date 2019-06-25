const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

const scholarshipSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String, required: true },
    cert1: { type: String, required: true },    // certificado notas
    cert2: { type: String, required: true },    // certificado socio-economico
    // certs: { type: String, required: true },
    status: { 
        type: String,
        required: true,
        enum: ['accepted',
            'rejected',
            'waiting'        
        ],
        default: 'waiting'
    }
});

module.exports = mongoose.model('scholarship', scholarshipSchema);