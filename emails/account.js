require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: 'test@gmail.com',
        from: process.env.email,
        subject: 'Thanks for signing up',
        text: `Welcome to the app, ${name}!`
    })
    .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}
module.exports = sendWelcomeEmail