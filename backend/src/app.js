require('dotenv').config();
const connectDB = require('./config/db'); 
const express = require("express");
const cors    = require("cors"); 
const uploadRoutes = require("./routes/sightingRoutes")

const app = express();
const port = 3000;
connectDB(); 


app.use(cors()); //to communicate with frontend
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