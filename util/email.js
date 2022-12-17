import sgMail from "@sendgrid/mail";

function init() {
  console.log("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");
  sgMail.setApiKey("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");  
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
