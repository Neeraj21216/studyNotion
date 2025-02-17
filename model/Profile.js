require("dotenv").config();
const mongoose=require("mongoose");
//what are thing 
const profileSchema=new mongoose.Schema({
    //what would  you like to do here just go on and dont sit back
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNo:{
        type:Number,
        trim:true,
    }
});
module.exports=mongoose.model("Profile",profileSchema);