
import nodemailer from "nodemailer"

export const sendEmail = async (to , subject  , html , attachments )=>{
    const transporter = nodemailer.createTransport({
      service : "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    
    
      const info = await transporter.sendMail({
        from: `"Abdo👻" <${process.env.EMAIL}>`, 
        to: "abdallahabohegazy57@gmail.com ", 
        subject: subject ? subject :"Hello ✔", 
        html: html ? html : "<b>Hello world?</b>", 
        attachments : attachments ? attachments : []
      });

      if(info.accepted.length){
        return true
      }
      return false
}



