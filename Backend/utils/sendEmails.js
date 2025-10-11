import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * sendEmail(to, subject, text)
 * Sends an email using Gmail SMTP.
 * Logs success or failure.
 */
const sendEmail = async (to, subject, text) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set. Skipping email send.");
    console.log("📨 Email preview:", { to, subject, text });
    return;
  }

  try {
    // Use SMTP directly for reliability
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: user, // must match your Gmail account
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Nodemailer error:", err.message);
    // Optional: log full error for debugging
    console.error(err);
    throw err; // allows controller to catch and respond
  }
};

export default sendEmail;
