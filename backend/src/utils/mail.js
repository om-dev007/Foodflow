import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.USER,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp} </b>. It expires in 5 minutes. </p>`
  })
}