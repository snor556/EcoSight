const express = require("express");
const getSpeciesInfo = require("../services/speciesInfo.js");
const router = express.Router();
const upload = require("../middlewares/multerMiddleWare.js");
const identifySpecies = require("../services/mlClients.js");
const parseDms = require("../utils/geoUtils.js");
const Sighting = require("../models/Sighting.js");
//upload is middleware imported
//single attributes indicates => work with single file
router.get('/nearby',async(req,res) => {
    const lat = parseFloat(req.query.lat)
    const lng = parseFloat(req.query.lng)
    const radius = parseFloat(req.query.radius)
    
    //note when entering in query long,lat and then radius 

    //check if the field is empty
    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        return res.status(400).json({ 
            message: "Please provide valid lat, lng, and radius in the URL parameters." 
        });
    }
    try {
       const sightings = await Sighting.find(
            {
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [ lng , lat ] // [Longitude, Latitude]
      },
      $maxDistance: radius // In meters 
    }
  }
}
     ) //to find specific data in mongodb
    res.json({
        count : sightings.length,
        data : sightings
    })
    } catch (error) {
        console.log("error : ",error)
        res.status(500).json({message : error.message})
    }
})

router.post('/sighting',upload.single('file'),async (req,res)=>{
    try {

        //check if the file is present
        if(!req.file){
            throw new Error("file not uploaded retry again")
        }
        else{
            console.log("routes reached")
            console.log(req.file)


            //calls the service for flask
           const prediction = await identifySpecies(req.file.path,
            req.body.latitude,
            req.body.longitude);
            
            const info = await getSpeciesInfo(prediction.species)

            const lat = req.body.latitude;
            const decLat = parseDms(lat);
            const long =req.body.longitude;
            const decLong = parseDms(long);
            const newSighting = new Sighting({
                imageUrl : req.file.filename,
                species : prediction.species,
                confidence : prediction.confidence,
                location : {
                    type : 'Point',
                    coordinates : [decLong , decLat]
                },
                description : info
            });
            const savedSighting = await newSighting.save()
            res.json({
                "message" : "image recieved successfully",
                data : savedSighting
            })
        }
    } catch (error) {
        console.error("error is",error);
        res.status(400).json({
            message : error.message
        })
    }
})

module.exports = router;