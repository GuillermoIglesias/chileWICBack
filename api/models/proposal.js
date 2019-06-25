const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)

const proposalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    theme: { type: String, enum: ['technical', 'study'] },
    duration: { type: Number },
    type: { 
        type: String,
        trim: true,
        required: true, 
        enum: ['keynote', 
            'short-talk', 
            'competition', 
            'panel', 
            'workshop'
        ]
    },
    file: { type: String, required: true },
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

proposalSchema.virtual('evaluation',{
    ref: 'evaluation',
    localField: '_id',
    foreignField: 'proposal'
})

proposalSchema.set('toObject', { virtuals: true });
proposalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('proposal', proposalSchema);