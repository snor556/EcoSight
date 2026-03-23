const axios = require("axios");
const FormData = require("form-data");

async function identifySpecies(imageUrl, lat, long){
    try {
        // 1. Download the image from Cloudinary as a data stream
        const imageResponse = await axios.get(imageUrl, { 
            responseType: 'stream' 
        });
        
        const formData = new FormData();
        
        // 2. Append the downloaded stream directly into the form
        // We add "cloud_image.jpg" so the Python server recognizes it as a valid file format
        formData.append("file", imageResponse.data, "cloud_image.jpg");
        formData.append("latitude", lat);
        formData.append("longitude", long);
        
        // 3. Send the loaded form to your Python Flask server
        const response = await axios.post("http://localhost:5000/predict", formData, {
            headers: formData.getHeaders()
        });
        
        return response.data;

    } catch (error) {
        // Changed to error.message to log properly, and added a throw statement
        // so the main route safely catches the crash instead of returning undefined!
        console.error("ML error : ", error.message);
        throw error; 
    }
}

module.exports = identifySpecies;