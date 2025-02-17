const {instances}=require("../config/razorpay");
const Course=require("../model/Course");
const User=require("../model/User");
const mailsender=require("../utils/mailSender");
// const {courseEnrollmentEmail}=require("../");
const { mongo, default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");

//capture the Payment and initiate the Razorpay Order

exports.capturePayment=async (req,res) => {
    
        //get CourseId  and UserId 
        const {course_id}=req.body;
        const userId=req.user.id;
        //validation 
        //valid CourseId 
        if(!course_id){
            return res.status(400).json({
                success:false,
                message:"Please Provide Valid Course ID",
            })
        };

        //valid courseDetail
        let course;
        try {
            course=await Course.findById(course_id);
            //
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"could NOt find the course",
                })
            }

            //user already paid for the same course 
            const uid=new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"Student is already Enrolled",
                })
            }
            

        } catch (error) {
           console.error(error);
           return res.status(500).json({
            success:false,
            message:"problem during payment Process verification",
            error:error.message,
           }) 
        }
        //order create Kro 
        const amount=course.price;
        const Currency="INR";
        const Options={
            amount:amount*100,
            Currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,
            }

        };

        try {
            //initiate the payment using razrorpay
            const paymentResponse=await instances.orders.create(options);
            console.log(paymentResponse);
            //return response
            return res.json({
                success:true,
                courseName:course.courseName,
                courseDescritpion:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            })
        } catch (error) {
            
        }

}



//verification and authorisation
//hmac requires hash algo and secret_key,

exports.verifySignature=async (req,response) => {
    const webhookSecret="12345678";
    const signature=req.headers["x-razorpay-signature"];
    const shashum=crypto.createHmac("shah256",webhookSecret);
    shashum.update(JSON.stringify(req.body));
    //digest is generally inhexadecimal format
    //req.does not contain user id its came from api heat
    //req.body.payload.payment.entity.notes it contiain inserted notes object
    const digest=shashum.digest("hex");

    if(signature===digest){
        console.log("Payment is Authorised");
        const {courseId,userId}=req.body.payload.entity.notes;

        try {
            //fullfill the action 

            //find the course and enroll the students in it
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
               {
                $push:{ studentsEnrolled:userId,}
               },{new:true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course Not found",
                       
                })
            }
            console.log(enrolledCourse);

            //find the student and add to their list enrolled course me
            const enrolledStudents=await User.findOneAndUpdate({_id:userId},
                                {
                                    $push:{
                                        courses:courseId,

                                    }
                                },{new:true},
            );

            //mail send krdo confirmation wala
            const emailResponse=await mailSender(
                enrolledStudents.email,
                "Congratulation From codehelp",
                "Congratulation ,you are onboarded into new Codehelp Course",
            )
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature Verified and Course Added",
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message:"Problem during Signature verification",
            })
        }
    }

    
}
