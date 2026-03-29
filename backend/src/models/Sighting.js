const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema(
    { // ARGUMENT 1: The Definition Object (All database columns go in here!)
        imageUrl: {
            type: String,
            required: true
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
                enum: ['Point'],  // must be exactly 'Point'
                required: true
            },
            coordinates: {
                type: [Number],   // [longitude, latitude]
                required: true
            }
        },
        description : {
            type : String,
        },
        // NEW: The user field is now safely inside the definition object!
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',   // This exactly matches the 'User' export in your User.js file
            required: true // A sighting MUST have an owner
        },
        // NEW SOCIAL HUB FIELDS:
        title: { type: String },
        tag: { type: String, default: 'Discussion' },
        upvotes: { type: Number, default: 0 },
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { // ARGUMENT 2: The Options Object
        timestamps: true  // adds createdAt and updatedAt automatically
    }
);

// Required for geospatial queries later (e.g. find nearby sightings)
sightingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Sighting', sightingSchema);