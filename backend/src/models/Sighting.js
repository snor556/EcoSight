const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema(
{
    imageUrl: {
        type: String,
        required: false
    },
    species: {
        type: String,
        required: true
    },
    confidence: {
        type: Number
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String },
    tag: { type: String, default: 'Discussion' },
    upvotes: { type: Number, default: 0 },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    
    poll: {
        options: [{
            text: String,
            votes: { type: Number, default: 0 }
        }],
        votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Sighting', sightingSchema);