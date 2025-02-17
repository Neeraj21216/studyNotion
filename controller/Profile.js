const Profile=require("../model/Profile");
const User=require("../model/User");
const {uploadImageTocloudinary}=require("../utils/imageUplaoder");

exports.updateProfile=async (req,res) => {
    try {
        //get data
        const {dateOfBirth="",about="",contactNo,gender,firstName,lastName}=req.body;
        //get userId
        const id=req.user.id;
        //validation
        if(!contactNo||!gender||!id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

         console.log("profileDetailsare :before->",profileDetails);
        if(firstName && lastName){
             userDetails.firstName=firstName;
             userDetails.lastName=lastName;
             userDetails.save();

        }
        
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNo=contactNo;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:'profile Updated successfully',
            profileDetails,
            userDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while Updation Profile",
            error:error.message,
        })
    }
}
//delete account
exports.deleteAccount=async (req,res) => {
    try {
        //get id 
        const id=req.user.id;
        //validation 
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User Not Found",
            })
        }
        //delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete(id);
        //return response
        //TODO:hw  unenroll user from all enrolled Courses
        //explore what is chrone job 
        return res.json({
            success:true,
            message:"Account Deleted Successfully",
        })

    } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"something went wrong while Deleting  Account",
            error:error.message,
        })
    }
}
exports.getAllUserDetails=async (req,res) => {
    try {
            //get id 
        const id=req.user.id;
        //validation 
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        //return response
        console.log("userDetails",userDetails);
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while fetching all User  Details",
            error:error.message,
        })
    }
}
exports.updateDisplayPicture=async (req,res) => {
    //user id so just
    try {
        const userId=req.user.id;
        const image=req.files.profileImage;
        console.log("hii i am here ")
        const uploadDetails=await uploadImageTocloudinary(image,process.env.FOLDER_NAME);
        console.log("uploadDetails are->",uploadDetails)
        const userDetails=await User.findByIdAndUpdate({_id:userId},{
            image:uploadDetails.secure_url
        },{new:true});
        if(!userDetails){
            res.status(400).json({
                success:false,
                message:"User Not found",
            })
        }
        console.log("userDetails",userDetails);

        return res.status(200).json({
            success:true,
            message:"Profile changed successfully",
            userDetails,
        })
  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong while Uploading file Details",
            error:error.message,
        }) 
    }
}