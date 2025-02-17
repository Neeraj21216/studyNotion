const User=require("../model/User");
const jwt=require("jsonwebtoken");


//auth 

exports.auth=async (req,res,next) => {
    try {
        //fetch toke 
        const token = 
        req.cookies.token || 
        req.body.token || 
        (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
            if(!token){
            return res.status(401).json({
                success :false,
                message:"Token is missing",
            })
        }
        //verify the token 

        try {
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log("decoded Content  is",decode);
            //you have attached the docume
            req.user=decode;

        } catch (error) {
            
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success :false,
            message:"something went wrong while validating the token ",
        })
    }
    
}

//isStudent
exports.isStudent=async (req,res,next) => {
   try {
    if(req.user.accountType!=="Student"){
        return res.status(401).json({
            success :false,
            message:"This is a protected route for Students only ",
        })
    }
    next();
   } catch (error) {
    return res.status(500).json({
        success :false,
        message:"User role Can not be verified ,please try again ",
    })
   }
    
}

//isInstructor
exports.isInstructor=async (req,res,next) => {
    try {
     if(req.user.accountType!=="Instructor"){
         return res.status(401).json({
             success :false,
             message:"This is a protected route for Instructor only ",
         })
     }
     next();
    } catch (error) {
     return res.status(500).json({
         success :false,
         message:"User role Can not be verified ,please try again ",
     })
    }
     
 }
 

//isAdmin
exports.isAdmin=async (req,res,next) => {
    try {
     if(req.user.accountType!=="Admin"){
         return res.status(401).json({
             success :false,
             message:"This is a protected route for Admin only ",
         })
     }
     next();
    } catch (error) {
     return res.status(500).json({
         success :false,
         message:"User role Can not be verified ,please try again ",
     })
    }
     
 }