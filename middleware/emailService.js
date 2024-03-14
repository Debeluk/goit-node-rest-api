// emailService.js
import axios from "axios";
import { config } from "dotenv";

config();

export const sendVerificationEmail = async (email, verificationToken) => {
  const apiKey = process.env.ELASTIC_EMAIL_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;
  const verificationLink = `${process.env.BACKEND_URL}/api/users/verify/${verificationToken}`;

  const data = {
    apikey: apiKey,
    from: senderEmail,
    to: email,
    subject: "Verify Your Email",
    bodyHtml: `<html><body><p>To verify your email, please click the following link: <a href="${verificationLink}">${verificationLink}</a></p></body></html>`,
    isTransactional: true,
  };

  try {
    const response = await axios.post(
      "https://api.elasticemail.com/v2/email/send",
      new URLSearchParams(data).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Email sent successfully", response.data);
  } catch (error) {
    console.error("Error sending verification email", error);
  }
};
