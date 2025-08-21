import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

const transpoter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
    }
});

export function sendResetPasswordMail(receiveremail,callbacktoken){
    const mailOption={
        from: process.env.SENDER_EMAIL,
        to: receiveremail,
        subject: "Reset Your Password",
        html: `<p> We have Received a Reset password request from you, Please use this token to reset your password. <br>OTP:- ${callbacktoken} <br>Ignore the email if it wasn't you.<br>Regards,<br>Team Squid</p>`,
    };

    transpoter.sendMail(mailOption).then((info)=>{
        console.log(info.response);
    })
    .catch((err)=>{
        throw err;
    })

}