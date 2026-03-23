// function parseDms(dmsString){

//  const asFloat = parseFloat(dmsString);
//     if (!isNaN(asFloat) && !dmsString.includes('°') && !dmsString.includes("'") && !dmsString.includes('"')) {
//         return asFloat;
//     }

// const parts = dmsString.split(/[\u00B0\u2032\u2033]/);

// const degree = Number(parts[0]);
// const minutes = Number(parts[1]);
// const seconds = Number(parts[2]);
// const decimal_val = degree + (minutes / 60) + (seconds / 3600);
// console.log(decimal_val)
// return decimal_val;
// }

// module.exports = parseDms;

function parseDms(dmsString) {
    // 1. Safety check for purely decimal inputs (e.g. "77.5167")
    const asFloat = parseFloat(dmsString);
    if (!isNaN(asFloat) && !dmsString.includes('°') && !dmsString.includes("'") && !dmsString.includes('"')) {
        return asFloat;
    }

    // 2. Split using both typographical primes AND standard keyboard quotes
    const parts = dmsString.split(/[\u00B0\u2032\u2033'"]/);

    // 3. Extract parts, safely defaulting to 0 if they don't exist
    const degree = Number(parts[0]) || 0;
    const minutes = Number(parts[1]) || 0;
    const seconds = Number(parts[2]) || 0;

    // 4. Calculate the final decimal value
    const decimal_val = degree + (minutes / 60) + (seconds / 3600);
    console.log("Parsed Coordinate:", decimal_val);
    
    return decimal_val;
}

module.exports = parseDms;