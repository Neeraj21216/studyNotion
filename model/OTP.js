const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
//do we need extra 
const OTPSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,

  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:10*60,
  }
});
//a function ->to send emails

async function sendVerificatinEmail(email,otp) {
    try {
      const mailResponse=await mailSender(email,"Verification email from StudyNotion",otp);
      console.log("Email sent Successfully");

    } catch (error) {
      console .log("error occured while sending mail",error);
      throw error;
    }
}
//why do we use error and all that just go on and dont do it 
OTPSchema.pre("save",async function (next) {
  await sendVerificatinEmail(this.email,this.otp);
  next();
  
})




module.exports=mongoose.model("OTP",OTPSchema);