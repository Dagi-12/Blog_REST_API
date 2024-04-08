const nodeMail = require("nodemailer");
const { emailPassword, senderEmail } = require("../config/keys");
const sendEmail = async ({ emailTo, subject, code, content }) => {
  const transporter = nodeMail.createTransport({
    host: "smtp.gmail.com",
    //465 true and 587 false
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: emailPassword,
    },
  });
  const message = {
    to: emailTo,
    subject,
    html: `
    <div> 
       <h3> use the code below to ${content}</h3>
       <p><strong>code:${code} </strong></p>
    </div>
    `,
  };
  await transporter.sendMail(message)
};
module.exports = sendEmail;
