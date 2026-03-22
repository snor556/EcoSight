const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema(
    {
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
            // required: true
        }
    },
    {
        timestamps: true  // adds createdAt and updatedAt automatically
    }
);

// Required for geospatial queries later (e.g. find nearby sightings)
sightingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Sighting', sightingSchema);