const mongoose=require("mongoose");
//do we need extra 
const CourseProgress=new mongoose.Schema({
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        },
        completedVideos:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
});
module.exports=mongoose.model("CourseProgress",CourseProgress);