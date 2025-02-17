const User=require("../model/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");


//resetPassWordToken
exports.resetPasswordToken=async (req,res)=>{
    try {
        //
        const email=req.body;

        const user=await User.findOne(email)
        // console.log("hii");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your Email is Not registered with us"
            })
        }
        //generate token 
        const token=crypto.randomUUID();
        //best way to get token bam 
        //update user by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate(email,{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },{new:true});
        //create Url 
        const url=`http://localhost:3000/update-password/${token}`
        //send mail containing the url
        const body=`Your link for email verification is ${url}. Please click this url to reset your password.`;
        const title='Password Reset Link';
       await mailSender(
            email,
            title,
            body,
        );
        //return response
        console.log(res);
        return res.json({
            success:true,
            message:"email sent successfully",
            token,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Problem in creating resetPasswordToken",
        })
    }
}
exports.resetPassword=async (req,res) => {
    try {
        //data fetch
        const {password,confirmPassword,token}=req.body;

        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            })
        }
        //get userDetails form db using token
        const userDetails =await User.findOne({token:token});
        //if no entry -invalid tokne
        console.log(userDetails);
        if(!userDetails){
            //jsut be realtime
            return res.json({
                success:false,
                message:"Token is invalid",
            })
        }
        //token time check 
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token is expiresd,please regenerate your token",
            })
        }
        //hash pwd 
        const hashedPassword=await bcrypt.hash(password,10);

        //password update
        console.log("hashedpassword is :",hashedPassword);
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},
            {new:true   },
        );
        return res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })

    } catch (error) {
        console.log(error);
        return res.json({
            success:false,
            message:"something went wrong while reseting password",
        })
    }
}