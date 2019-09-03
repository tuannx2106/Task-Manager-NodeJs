const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)
// sendGrid.send({
//   to: 'supernija21@gmail.com',
//   from: 'supernija21@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// })

const sendWelcomeEmail = (email, name) => {
  sendGrid.send({
    to: email,
    from: 'supernija21@gmail.com',
    subject: `Thanks for joining in, ${name}!`,
    text: `Welcome to the Task App, ${name}`
  })
}

const sendCancelEmail = (email, name) => {
  sendGrid.send({
    to: email,
    from: 'supernija21@gmail.com',
    subject: `Thanks for using Task App, ${name}!`,
    text: `Bye ${name}`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
