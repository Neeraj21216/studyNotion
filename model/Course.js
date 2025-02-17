const mongoose=require("mongoose");
//do we need extra 
const CourseSchema=new mongoose.Schema({
    //now fill entry for courseSchema 
    courseName:{
        type:String,
        required:true,
        trim:true,

    },
    courseDescription:{
        type:String,
        required:true,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    },
    //what will you learn is a descritpino
    whatWillYoulearn:{
        type:String,
        // required:true,
        trim:true,
    },
    courseContent:[
        //course content k andar multiple section aate h iska mtlb h list create krni pdegi
    
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    RatingAndReview:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
        // required:true,
    }
    ],
    price:{
        type:Number,

    },
    thumbnail:{
        type:String,
        
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",

    },
    studentsEnrolled:[
        {type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"}
        ]

});
module.exports=mongoose.model("Course",CourseSchema);