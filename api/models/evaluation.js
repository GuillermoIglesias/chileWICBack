const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

const evaluationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reviser: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    proposal: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Proposal' },
    score: { type: Number, trim: true, enum: [-2,-1, 0, 1, 2], default: 0 },
    message: { type: String, default: '' },
    finished: { type: Boolean, trim: true, default: false } 
});

module.exports = mongoose.model('evaluation', evaluationSchema);