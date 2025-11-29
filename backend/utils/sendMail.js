const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
       user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendMail = async (to, subject, html) => {
  console.log("Sending email to:", to); // Debug

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
};
