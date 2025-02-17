//
const Section =require("../model/Section");
const User = require("../model/User");
const Course=require("../model/Course");

exports.createSection=async (req,res) => {
    try {
        //data fetch 
        const {sectionName,courseId}=req.body;
        //data validation 
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //create section
        console.log("hi");
        const newSection = await Section.create({ sectionName });
        //  update course with secton ObjectId;

    //   cosnole.log(newSection);
    const updatedCourse=    await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                courseContent:newSection._id,
            }
            

        },{new:true}) 
                console.log("hi");

        //hw :use Populate to replace section /sub-section both
    //        return response
    res.status(200).json({
        success:true,
        message:"section created Succesfully",
        updatedCourse,
    }

    )
    

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong during section creation ",
        })

    }
}


//update section
exports.updateSection=async (req,res) => {
    try {
        //data input
        const {sectionName,sectionId}=req.body;
        //data validation 
        if(!SectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }
        //update data 
        const section =await Section.findByIdAndUpdate({sectionId},{sectionName},{new:true});
        //return res
        res.status(200).json({
            success:true,
            message:"section updated Succesfully",
        });
    
        

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong during section updation ",
        })
    }
}
//delete id 
exports.deleteSection=async (req,res) => {
    try {
         //get id -assuming that we are sending id in params 
         const {sectionId}=req.params;
         //data validation 
         if(!sectionId){
             return res.status(400).json({
                 success:false,
                 message:"Missing Properties",
             })
         }
         //delete section 
         await Section.findByIdAndDelete({sectionId});
         //todo :do we need to delete the entry from the course schema
         
         res.status(200).json({
             success:true,
             message:"section deleted Succesfully",
         });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong during section deletion ",
        })
    }
}