import nodemailer from 'nodemailer';
import envCredentials from '../config/env.js';


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "alkeshmanas0741@gmail.com",
        pass: envCredentials.passkey
    }
})

export default async function sendMail({ to, subject, text, html }) {

    const mailOption = {
        from: '"Manomilan" <alkeshmanas0741@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: html
    }


    await transporter.sendMail(mailOption, (err, info) => {
        if (!err) {
            return res.send({ status: true, message: "Mail Sent Successfully." })
        }
        else {
            return res.send({ status: false, message: "Mail Not Sent." })
        }
    })

}