const nodemailer=require("nodemailer");

const mailSender=async (email,title,body)=>{
    try {
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            //you need someone as mailer so go and complete that nodemailer 
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
            

        })
        console.log("emails is ",email);
        let info=await transporter.sendMail({
            from:'studyNotin||codehelp-by neeraj',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,

        })
  
        console.log("info in mail->",info);
        return info;
    } catch (error) {
        console.log("mailsender erroris->:",error.message);
    }
}
//efforts 
module.exports=mailSender;
