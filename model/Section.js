const mongoose=require("mongoose");
//do we need extra 
const sectionSchema=new mongoose.Schema({
    sectionName:{
        type:String,
    },
    subSection:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true, 
        ref:"SubSection",
    }
});
module.exports=mongoose.model("Section",sectionSchema);