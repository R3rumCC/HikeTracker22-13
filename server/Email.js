const express = require('express');
const email = express.Router();
const nodemailer = require('nodemailer');

//  creat a sender
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secureConnection: true, // use SSL
    auth: {
        user: '736076274@qq.com', 
        pass: 'cllzsmveiqlmbfae', 
    },
});

email.get('/', (req, res) => {
    const to=req.body.email;
    let code = Math.floor(Math.random()*900000)

    const mailOptions = {
        from:'"HIKETRACKER"<736076274@qq.com>',
        to, 
        subject:'Thie is your Verification Code', // title
       html:`<div style="vh-100 justify-content-md-center"><h1 style="text-align:center;">${code}</h1></div>`
    };
    //  send
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(info);
    });
    res.send('已成功发送邮件！');
});

module.exports = email;
