//what you will need to do just go on and dont do foolishness 

const Tag=require("../model/Category");
//done importing 

exports.createCategory=async (req,res)=>{
    try {
        //fetch data 
        const  {name,description}= req.body;
        //validateit 
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",

            })
        }
        //create entry in db 
        //course additon hm usme dekhenge
        const  tagDetails=await Tag.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong in Tag creation ",
            //what do ewe have to do 

        })
    }
}
//get All tags
exports.showAllCategory=async (req,res) => {
    try {
        //find all tags and make sure that it contain name ,description

        const  allTags=await Tag.find({},{name:true,description:true});
        
        return res.status(200).json({
            success:true,
            message:"allTag fetched  successfully",
            allTags
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went Wrong in Tag creation ",
            //what do ewe have to do
            message2:error.message, 

        })
    }
}