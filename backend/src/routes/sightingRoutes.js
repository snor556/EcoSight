const express = require("express");
const router = express.Router();

const getSpeciesInfo = require("../services/speciesInfo.js");
const upload = require("../middlewares/multerMiddleWare.js");
const identifySpecies = require("../services/mlClients.js");
const parseDms = require("../utils/geoUtils.js");
const Sighting = require("../models/Sighting.js");

// NEW 1: Added curly braces {} around getUserSightings!
const { getUserSightings , getAllSightings , upvotePost, addComment} = require("../controllers/sightingController.js");
const { protect } = require('../middlewares/authMiddleware');

router.get('/nearby', async(req,res) => {
    // ... (Your nearby logic remains exactly the same)
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        return res.status(400).json({ message: "Please provide valid lat, lng, and radius in the URL parameters." });
    }
    try {
       const sightings = await Sighting.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [ lng , lat ] },
                    $maxDistance: radius 
                }
            }
        });
        res.json({ count : sightings.length, data : sightings });
    } catch (error) {
        console.log("error : ",error);
        res.status(500).json({message : error.message});
    }
});

router.get('/sightings/me', protect, getUserSightings);
// The Global Community Route
router.get('/sightings', protect, getAllSightings);

// NEW 2: Added the 'protect' Bouncer to the upload route so we know WHO is uploading
router.post('/sighting', protect, upload.single('file'), async (req,res)=>{
    try {
        if(!req.file){
            throw new Error("file not uploaded retry again")
        } else {
            const prediction = await identifySpecies(req.file.path, req.body.latitude, req.body.longitude);
            
            const lat = req.body.latitude;
            const decLat = parseDms(lat);
            const long =req.body.longitude;
            const decLong = parseDms(long);

            let finalSpeciesName = prediction.species;

            // Check if coordinates fall inside the India Bounding Box
            const isInsideIndia = (decLat >= 8 && decLat <= 37) && (decLong >= 68 && decLong <= 97);
            
            // Check if the AI's raw guess contains "African" and "Elephant"
            const guessedAfrican = finalSpeciesName.toLowerCase().includes("african") && 
                                   finalSpeciesName.toLowerCase().includes("elephant");

            if (isInsideIndia && guessedAfrican) {
                console.log("📍 Geographic Override Triggered: Swapping African Elephant to Indian Elephant.");
                finalSpeciesName = "Indian Elephant";
            }

            const info = await getSpeciesInfo(prediction.species, decLat, decLong);
            
            const newSighting = new Sighting({
                imageUrl : req.file.path,
                species : finalSpeciesName,
                confidence : prediction.confidence,
                location : {
                    type : 'Point',
                    coordinates : [decLong , decLat]
                },
                description : info ? info.summary : "Information currently unavailable.",
                // NEW 3: We attach the logged-in user's ID to the photo!
                user: req.user._id 
            });
            
            const savedSighting = await newSighting.save();
            res.json({
                "message" : "image recieved successfully",
                data : savedSighting
            });
        }
    } catch (error) {
        console.error("error is",error);
        res.status(400).json({ message : error.message });
    }
});

// NEW: Manual Community Post (Skips the AI model)
router.post('/sightings/discussion', protect, upload.single('file'), async (req, res) => {
    try {
        const newPost = new Sighting({
            title: req.body.title,
            tag: req.body.tag,
            description: req.body.content, // We save the user's text into the description field
            species: "Unknown / Pending",  // Default for discussions
            imageUrl: req.file ? req.file.path : null, // Image is optional for discussions!
            user: req.user._id,
            location: {
                type: 'Point',
                coordinates: [0, 0] // [longitude, latitude]
            }
        });
        
        const savedPost = await newPost.save();
        res.status(201).json({ success: true, data: savedPost });
    } catch (error) {
        console.error("Discussion post error:", error);
        res.status(400).json({ message: error.message });
    }
});

// Social Interaction Routes
router.put('/sightings/:id/upvote', protect, upvotePost);
router.post('/sightings/:id/comment', protect, addComment);
module.exports = router;