const Section=require("../model/Section");
const {uploadImageTocloudinary}=require("../utils/imageUplaoder");
const subSection=require("../model/SubSection");

exports.createSubsection=async (req,res) => {
    try {
        //fetch data from req body
        const {sectionId,title,timeDuration,descritpion}=req.body;
        //extract file /video
        
        const video=req.files.videoFile;
                //validation

        if(!sectionId||!title||!timeDuration||!descritpion||!video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
                //upload a video to cloudinary

        const uploadDetails=await uploadImageTocloudinary(video,process.env.FOLDER_NAME);


        //create a sub-section
        const subSectionDetaile=await subSection.create({
            title:title,
            timeDuration:timeDuration,
            description:descritpion,
            videoUrl:uploadDetails.secure_url,
        });
        //update section whith this sub section objectid
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetaile._id,
            }
        },{new:true})
        //return response
        //hw :update section here,after adding populate query
        return res.status(200).json({
            success:true,
            message:"subSection created Successfully",
        });


    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"something went Wrong while creating SubCectio n ",
            })
    }
}
//delete a subsection 
exports.deleteSubsection=async (req,res) => {
    try {
        const {subSectionId}=req.body;
        //validate it
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all details"
            })
        }
        const subsectionDetails=await subSection.findByIdAndDelete({subSectionId});
        //ye use section se v to delete kro 

        return res.status(200).json({
            success:true,
            message:"subSection Deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success:false,
            message:"Something went Wrong during subSection Creation",
        });
       
    }
}
//update a section 
exports.updateSubSection=async (req,res) => {
    try {
        const {subSectionId,title,timeDuration,descritpion}=req.body;
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all details",
            })
        }

        const updatedSubSectionDetails=await subSection.findByIdAndUpdate({_id:subSectionId},{title,timeDuration,descritpion},{new:true},);
        return res.status.json({
            success:true,
            message:"subSection Updated successfully",
        })
    } catch (error) {
        
    }
}
