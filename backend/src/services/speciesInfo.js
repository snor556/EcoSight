const axios = require("axios");

// Step 1 — convert lat/lng to country name (free, no API key needed)
async function getCountryFromCoords(lat, lng) {
    try {
        const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&accept-language=en&format=json`,
            {
                headers: {
                    "User-Agent": "EcoSight/1.0 (beastq010@gmail.com)"
                }
            }
        );
        const country = res.data.address.country;
        console.log("Country detected:", country);
        return country; // e.g. "India", "Kenya", "Brazil"

    } catch (error) {
        console.error("Geocoding error:", error.message);
        return null;
    }
}

// Step 2 — search Wikipedia with species + country
async function searchWikipedia(query) {
    try {
        // first search for the best matching article
        const searchRes = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=1`,
            {
                headers: {
                    "User-Agent": "EcoSight/1.0 (beastq010@gmail.com)"
                }
            }
        );
        //optional chaining returns undefined for missing in case of null
        const topResult = searchRes.data?.query?.search?.[0];
        if (!topResult) return null;

        console.log("Wikipedia top result:", topResult.title);

        // then fetch the summary of that article
        const summaryRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topResult.title)}`,
            {
                headers: {
                    "User-Agent": "EcoSight/1.0 (beastq010@gmail.com)"
                }
            }
        );

        return summaryRes.data;

    } catch (error) {
        console.error("Wikipedia search error:", error.message);
        return null;
    }
}

async function getSpeciesInfo(species, lat, lng) {
    try {
        const country = await getCountryFromCoords(lat, lng);

        // ✅ use let — needs to be reassignable
        let query   = country ? `${species} ${country}` : species;
        let wikiData = await searchWikipedia(query);

        console.log("Searching Wikipedia for:", query);

        // Strike 1 failed — try generic search
        if (country && (!wikiData || !wikiData.title.toLowerCase().includes(species.toLowerCase()))) {
            console.log(`Strike 1 failed. Falling back to generic search for: ${species}`);

            // ✅ now reassignment works because of let
            query    = species;
            wikiData = await searchWikipedia(query);
        }

        if (!wikiData) return null;

        // Strike 2 failed — return just species name
        if (!wikiData.title.toLowerCase().includes(species.toLowerCase())) {
            console.log("Wikipedia result unrelated, falling back to species name");
            return { commonName: species, summary: null, wikiUrl: null };
        }

        return {
            commonName : wikiData.title,
            summary    : wikiData.extract,
            wikiUrl    : wikiData.content_urls?.desktop?.page,
            thumbnail  : wikiData.thumbnail?.source || null,
            country    : country
        };

    } catch (error) {
        console.error("getSpeciesInfo error:", error.message);
        return null;
    }
}


module.exports = getSpeciesInfo;