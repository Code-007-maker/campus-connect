const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendTeacherInvite(toEmail, plainPassword, name = '') {
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Your Campus Connect Instructor Account',
    text:
`Hello ${name || 'Instructor'},

An account has been created for you on Campus Connect.

Email: ${toEmail}
Password: ${plainPassword}

Please login and change your password.

Regards,
Campus Connect Team`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendTeacherInvite };
