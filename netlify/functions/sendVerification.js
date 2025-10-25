import nodemailer from "nodemailer";

export const handler = async (event) => {
  try {
    const { email, username, code } = JSON.parse(event.body);

    // Access secrets directly from Netlify environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Hello ${username},\n\nYour verification code is: ${code}\n\nUse it for login/verification. This code is one-time use only.`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent!" }),
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to send email." }),
    };
  }
};
