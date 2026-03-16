const express = require("express");

const router = express.Router();
const upload = require("../middlewares/multerMiddleWare.js");
const identifySpecies = require("../services/mlClients.js");

//upload is middleware imported
//single attributes indicates => work with single file
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
           const prediction = await identifySpecies(req.file.path);
            res.json({
                "message" : "image recieved successfully",
                "filename" : req.file.filename,
                "prediction" : prediction
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