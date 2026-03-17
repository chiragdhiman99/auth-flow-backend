const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    })
}

module.exports = sendEmail