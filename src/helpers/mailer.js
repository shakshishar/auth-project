import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import User from '../models/userModel';
import bcryptjs from "bcryptjs";

export const sendEmail=async({email, emailType,userId})=>{
console.log("verify section");
    try{
       const hashedToken= await bcryptjs.hash(userId.toString(),10);
        //todo: configure mail for usage
        if(emailType==="VERIFY"){
            await User.findByIdAndUpdate(userId,{
                $set:{
                verifyToken:hashedToken,
                verifyTokenExpiry:Date.now()+3600000
        }});
        }
        else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId,{
                $set:{
                    forgotPasswordToken:hashedToken,
                    forgotPasswordTokenExpiry:Date.now()+3600000
                }})
        }
        else{

        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "83dd4ba18156b7",
              pass: "3ced8ec810ef7c"
            }
          });

          const mailOptions=await transport.sendMail({
            from: 'sakshi@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType==='VERIFY'?"Verify your email":"Reset your password", // Subject line
            html:`<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> here </a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser </br>
            ${process.env.DOMAIN} /verifyemail?token=${hashedToken}</p>`, // html body

          });

          return mailOptions; 
    }catch(error){
        
        console.log("error in nodemailer", error);
        throw new error(error.message);
    }
}