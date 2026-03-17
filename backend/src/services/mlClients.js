const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
async function identifySpecies(filePath,lat,long){
    try {
        
        const formData = new FormData();
        //file => fieldname , createReadStream => reads data in stream
        //here it references the data
        formData.append("file",fs.createReadStream(filePath));
        formData.append("latitude",lat);
        formData.append("longitude",long);
        //formData => loads the data into server
        //here it is read in stream
        const response = await axios.post("http://localhost:5000/predict",formData,{
            //specify the header to multipart data
            headers:formData.getHeaders()
        })
    return response.data;

    } catch (error) {
        console.log("Ml services error");
        //this is for checking if it returns properly
        //not work properly due to not connected to flask
       const fallback = {prediction : "raven"}
       console.log("returning fallback", fallback)
       return fallback
    }
}

module.exports = identifySpecies;
