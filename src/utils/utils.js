/* The above code is creating a function that will send an email to the user. */
const nodemailer = require("nodemailer");
const UserToken = require("../Models/tokenModel");

const sendMail = async function (email, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "koursemate.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@koursemate.com", // your cPanel email address
      pass: "tZp)Il5j,)Uw", // your cPanel email password
    },
  });

  await transporter.sendMail({
    from: "info@koursemate.com",
    to: email,
    subject: subject,
    html: text,
  });
};

const deleteUserTokenIfDelayed = async (req, res) => {
  const cutoff = new Date(Date.now() - 5 * 60 * 1000);
  await UserToken.deleteMany({
    CreatedAt: { $lte: cutoff },
  });
};

module.exports = { sendMail, deleteUserTokenIfDelayed };
