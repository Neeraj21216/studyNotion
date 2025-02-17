const User=require("../model/User");
const OTP=require("../model/OTP");
const otpGenerator=require("otp-generator");
const bcrypt = require('bcrypt');
const Profile=require("../model/Profile");
const jwt=require("jsonwebtoken");
require("dotenv").config();




///send otp 
exports.sendOtp=async (req,res) => {
    try {

        const {email}=req.body;
        //validate the email 
        console.log(email);
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                messgae:"User already registered ",
            })
        }
        

        //generate otp we are repeatedly finding unique otp nad then check whether this is unique or not
        const otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("otp generated is :->",otp);
        //otp is changing a lot 
    
        let result=await OTP.findOne({otp});
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
             result=await OTP.findOne({otp});
        }
        //you got unique  otp and now crate otp   object 
        const otpPayload={email,otp};
        //create and entry for otp 
        const otpBody=await OTP.create(otpPayload);
        console.log("otp stored item is :->",otpBody);
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",

        })
        
    } catch (error) {
        console.log("error in signing  in ",error.messgae);
        
        res.status(400).json({
            success:false,
            message:"error in signing  in",
            
        })
    }
}
// exports.sendOtp = (req, res) => {
//     try {
//         // Your OTP logic
//         res.json({ success: true, message: "OTP sent successfully!" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// };

//signup 

exports.signUp=async (req,res) => {
    try {
        
        //fetch data 
        const {firstName,lastName,email,contactNumber,password,confirmPassword,accountType,otp}=req.body;
        //validate it
        if(!firstName||!lastName||!email||!password||!confirmPassword||!otp){
            return res.status(401).json({
                success:false,
                messgae:"please fill all details",
            })
        }
        //validate user 
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:false,
                message: "User already exist",
            });
        }
        //validate password
        if(confirmPassword!==password){
            return res.status(401).json({
                success:false,
                message:"Password and confirm Password didn't  match",
            })
        }


        //find most recent otp stored for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1});
        console.log(recentOtp);
            if (recentOtp) {
            console.log('Most recent OTP:', recentOtp);
            } else {
            console.log('No OTP found for this email.');
            }

         if(otp!==recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:"otp did not matched ",
            })
        }


        //we also need a profile
        //you will also need hashed passwordc
        // console.log("hii");
        const  hashedPassword=await bcrypt.hash(password,10);

        //userProfile
        console.log(hashedPassword);
        const userProfile=await Profile.create({
            gender:null,
            dateOfBirth:null,
            contactNo:null,
            about:null,
            
        })


        const user=await User.create({
            firstName,lastName,email,
            password:hashedPassword,
            accountType,
            additionalDetails:userProfile._id,
            //naikhe cdac me otp nagra aala 
            image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        res.status(200).json({
            success:true,
            messgae:"User is registered Successfully",
            user,
        })

    } catch (error) { 
        console.log("Error while signup ",error);
        res.status(500).json({
            success:false,
            message:"Error while signup",
            //aali aali 
        })
    }
}
//login
exports.login=async (req,res) => {
    try {
        //fetch data
        const {email,password}=req.body;
        //validate
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:"all Fields are required",
            })
        }
          //validate and fetch user
        const user=await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User is not registered,please Signup",
            })

        }
        let hashedPassword=user.password;
        //compare passowrd and 
        
        if(await bcrypt.compare(password,hashedPassword)){
            const payLoad={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token=jwt.sign(payLoad,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;
            //create cookie and send response
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Logged In successfully",
                token,
                user,
                
            })
        }
        else{
            res.status(401).json({
                success:false,
                message:"Password is incorrect",
                //half and half what are you 

            })
        }
        

        

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            message:"something went wrong while login",
            //half and half what are you 

        })


    }
}

//change Password
//how would you change the password 
exports.changePassword=async (req,res) => {
    
}
