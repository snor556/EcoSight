const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username :{
            type : String,
            required : true,
            unique : true, //keep it unique
            trim : true //remove blank spaces
        },

        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true //convert all the entry into lowercase
        },

        password : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true //automatically add created and updated time
    }
);


module.exports = mongoose.model('User',userSchema)