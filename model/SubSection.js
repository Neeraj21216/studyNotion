const mongoose=require("mongoose");
//do we need extra 
const subSectionSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
});
module.exports=mongoose.model("SubSection",subSectionSchema);