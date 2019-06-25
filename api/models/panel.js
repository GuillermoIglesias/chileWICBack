const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

const panelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Panel', panelSchema);