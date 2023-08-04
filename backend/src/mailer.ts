import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USERNAME as string,
    pass: process.env.MAIL_PASSWORD as string,
  },
});