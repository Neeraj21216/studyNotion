require("dotenv").config();
const mongoose=require("mongoose");
// const { resetPasswordToken } = require("../controller/ResetPassword");
//what are thing 
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    //aur kya information hongi yha pe 
    password:{
        type:String,
        required:true,
        //you just have to do that and 
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:String,
    },
    additionalDetails:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    //why did we used arrray here i dont know
    image:{
        type:String,
        required:true,
    },
    courseProgress:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"CourseProgress",
        }
    ],
});
module.exports=mongoose.model("User",userSchema);