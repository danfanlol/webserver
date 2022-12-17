import sgMail from "@sendgrid/mail";

function init() {
  
  sgMail.setApiKey(process.env.API);  
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
