const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Initialize Gemini with your vault key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Keep your awesome Reverse Geocoding function!
async function getCountryFromCoords(lat, lng) {
    try {
        const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&accept-language=en&format=json`,
            {
                headers: { "User-Agent": "EcoSight/1.0" }
            }
        );
        const country = res.data.address.country;
        console.log("Country detected:", country);
        return country; 
    } catch (error) {
        console.error("Geocoding error:", error.message);
        return null;
    }
}

// 3. The New Gemini-Powered Info Fetcher
async function getSpeciesInfo(species, lat, lng) {
    try {
        // Find the country first
        const country = await getCountryFromCoords(lat, lng);
        
        // Build context: If we don't have the country, fall back to coordinates
        const locationContext = country ? country : `latitude ${lat}, longitude ${lng}`;

        // Select the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // The Prompt Engine
        const prompt = `You are an expert wildlife biologist. The user just photographed a ${species} in ${locationContext}. 
        Write a fun, engaging, 3-sentence educational summary about this animal that focuses on its habitat, diet, and a fun fact. 
        Important: Return ONLY the plain text summary. Do not use markdown, bolding, asterisks, or conversational filler.`;

        // Generate the text
        const result = await model.generateContent(prompt);
        const summaryText = result.response.text().trim();

        console.log(`Successfully generated Gemini biography for ${species}`);

        // 4. Uphold the "Contract" by returning the same structure!
        // (We set wikiUrl and thumbnail to null since we don't scrape Wikipedia anymore)
        return {
            commonName : species,
            summary    : summaryText,
            wikiUrl    : null,
            thumbnail  : null,
            country    : country
        };

    } catch (error) {
        console.error("getSpeciesInfo error:", error.message);
        return {
            commonName: species,
            summary: "This is a fascinating species! Detailed AI information is currently taking a moment to load.",
            wikiUrl: null,
            thumbnail: null,
            country: null
        };
    }
}

module.exports = getSpeciesInfo;