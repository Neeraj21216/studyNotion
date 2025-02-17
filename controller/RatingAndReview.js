const RatingAndReview=require("../model/RatingAndReviews");
const Course=require("../model/Course");
const User=require("../model/User");
const { default: mongoose } = require("mongoose");
exports.createRating=async (req,res) => {
    try {
        //get user id
        const userId=req.user.id;
        //fetchdata from req body
        const {rating,review,courseId}=req.body;

        //check if user is enrolled or not 
        const courseDetail=await Course.findById({_id:courseId,
                                    studentEnrolled:{$elemMatch:{$eq:userId}},
        }) ;
        if(!courseDetail){
            return res.status(400).json({
                success:false,
                message:'Student is not enrolled in the course',
            })
            
        }


        //check if user reviewed the  Course
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:'Course is already reviewed by the user ',
            });
        }
        //create Rating and Review 
        const ratingReview=await RatingAndReview.create({
                  rating,review,
                  course:courseId,
                  user:userId,  
        });
        //update course with this rating/review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                RatingAndReview:ratingReview._id,
            }
        },{new:true});

        console.log(updatedCourseDetails); 
        //return responses
        return res.status(200).json({
            success:true,
            message:'Rating and review Created successfully',
            ratingReview,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went Wrong while creating RatingandReview',
        });
    }

}

//get averagerating
exports.getAverageRating=async (req,res) => {
    try {
        //courseId
        const {courseId}=req.body;
        //calculate avg rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])

        //return reating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        return res.status(200).json({
            success:true,
            message:"averageRating is 0,no rating given till now",
            averageRating:0,
        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went Wrong while fetching avgRating',
        });
    }
}
//getAll rating
exports.getAllRating=async (req,res) => {
    try {
        const allReview=await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName LastName email image",
        })
        .populate({
            path:"course",
            select:"courseName",
        }).exec();
        return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'something went Wrong while fetching avgRating',
        });
    }
}