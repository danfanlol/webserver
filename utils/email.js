import sgMail from "@sendgrid/mail";

function init() {
  console.log(process.env.SENDGRID_API_KEY);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);  
}

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    sgMail.send(mailOptions, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
}
sendEmail.init=init;
export default sendEmail;
