function parseDms(dmsString){

 const asFloat = parseFloat(dmsString);
    if (!isNaN(asFloat) && !dmsString.includes('°') && !dmsString.includes("'") && !dmsString.includes('"')) {
        return asFloat;
    }

const parts = dmsString.split(/[\u00B0\u2032\u2033]/);

const degree = Number(parts[0]);
const minutes = Number(parts[1]);
const seconds = Number(parts[2]);
const decimal_val = degree + (minutes / 60) + (seconds / 3600);
console.log(decimal_val)
return decimal_val;
}

module.exports = parseDms;