const express = require("express");
const uploadRoutes = require("./routes/sightingRoutes")

const app = express();
const port = 3000;


app.use(express.json())
// app.get("/test",(req,res) => {
//     const jsonData = {
//         "name" : "raven",
//         "location" : "india"
//     }
//     res.json(jsonData)
// })

//get the sighting routes
app.use("/api",uploadRoutes)


app.listen(port , () => {
    console.log(`listening on http://localhost:${port}`) 
})