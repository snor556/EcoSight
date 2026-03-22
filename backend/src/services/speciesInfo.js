const axios = require("axios");

async function getSpeciesInfo(species_Name){
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${species_Name}`,
            {headers: {
                    "User-Agent" : 'EcoSight/1.0 (beastq010@gmail.com)'
                }
            }
        )
        return response.data.extract;
    } catch (error) {
        console.error("error",error);
        console.log("info about this species is not currently available");
    }
}

module.exports = getSpeciesInfo;