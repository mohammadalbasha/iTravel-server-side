const nodemailer = require('nodemailer');
require('dotenv').config();
 
const nodeMailerAuth = {
    auth: {
        type: 'OAuth2',
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
        clientId: process.env.NODEMAILER_CLIENT_ID,
        clientSecret: process.env.NODEMAILER_CLIENT_SECRET ,
        refreshToken : process.env.NODEMAILER_REFRESH_TOKEN,
        accessToken  : process.env.NODEMAILER_ACCESS_TOKEN
      }
}


const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: nodeMailerAuth.auth
      });

module.exports.confirmAccount = (userId, userEmail) => {
    transporter.sendMail({
                from: '"Travel Assistant" <albashamohammad27@gmail.com>', // sender address
                to: userEmail, // list of receivers
                subject: "Acoount Confirmation ✔", // Subject line
                text: "please, Click on the Url to Confirm your email", // plain text body
                html: `<a href="http://localhost:5000/auth/confirmAccount/${userId}">
                          <button>
                            Click
                          </button>
                       </a>`, // html body
                })
        }