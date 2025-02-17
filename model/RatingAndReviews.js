require("dotenv").config();
const mongoose=require("mongoose");
//what are thing 
const RatingAndReviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,

    },
    review:{
        type:String,
        required:true,
    }
});
module.exports=mongoose.model("RatingAndReview",RatingAndReviewSchema);