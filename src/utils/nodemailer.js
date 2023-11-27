const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mariomastroviti1@gmail.com",
    pass: "jnet jinr jyka eimq"
  },
  tls: {
    rejectUnauthorized: false, 
    }
});


module.exports = transporter;



