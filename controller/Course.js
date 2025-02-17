//madarchod av btata hu 
const Tag=require("../model/Category");
const User=require("../model/User");
const Course=require("../model/Course");
const {uploadImageTocloudinary}=require("../utils/imageUplaoder");

exports.createCourse=async (req,res) => {
    try {
        //fetch data 
        const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
        //get thumbnail 
        const thumbnail=req.files.thumbnailImage;
        //validation 
        if(!courseName||!courseDescription||!price||!category||!thumbnail){
            //
            console.log(courseName);
            console.log(courseDescription);
            console.log(whatYouWillLearn);
            console.log(price);
            console.log(category);
            console.log(thumbnail);
            // console.log(courseName);

            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })

        }
        //check for instructor 
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        //todo->verify user id and instructordetail id are same or not 
        console.log("instuctor details are:",instructorDetails);
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor  details is not found",
            })
        }
        //check given tag is valid or not
        const tagDetails=await Tag.findById(category);
        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message:"tag  details is not found",
            })
        }

        //upload image to cloudinary
        const thumbnailImage=await uploadImageTocloudinary(thumbnail,process.env.FOLDER_NAME);

        //create and entryfor new Course 
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:tagDetails._id,
            instructor:instructorDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},{
            $push:{
                courses:newCourse._id,
            }

        },{new:true});
        //update the tag ka schema 
        //todo:hw
        await Tag.findByIdAndUpdate({_id:tagDetails._id},{
            $push:{
                course:newCourse._id,
            }
        });
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating Course",
        })
    }
}
//show all couse 
exports.showAllCourses=async (req,res) => {
    try {
        //change the below statement 
        const allCourses=await Course.find({})
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course Data",
            error:error.message,
        })
    }
}
//how wil 

exports.showCourseDetail=async (req,res) => {
    try {
        //yha pe kya chiz ki jrurat course id 
    //get id
        const {courseId}=req.body;
        //find Coursedetails 
        const courseDetail=await Course.find({_id:courseId}).populate(
            {
               path: "instructor",
               populate:{
                path:"additionalDetails",
               },
            }

        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            },
             
        }).populate("RatingAndReview").populate("category").exec();


//somehting has been changed so learn about tht 

        if(!courseDetail){
            return res.status(400).json({
                success:false,
                message:"Course Does Not Exist",
            })
        }
        //return response 
        return res.status(500).json({
            success:true,
            message:"Data fetched Successfully",
            data:courseDetail,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while fetching all details of course",
            error:error.message,
        })
    }
}
