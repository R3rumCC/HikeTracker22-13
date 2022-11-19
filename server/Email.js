const express = require('express');
const email = express.Router();
const dao = require('./DAO');
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

email.get('/getCode/:email',async (req, res) => {
    const to=req.params.email;
    let code = Math.floor(Math.random()*900000) +100000

    const mailOptions = {
        from:'"HIKETRACKER"<736076274@qq.com>',
        to, 
        subject:'This is your Verification Code', // title
       html:`<div style="vh-100 justify-content-md-center"><h1 style="text-align:center;">${code}</h1></div>`
    };
    //  send
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log(info);
    });
    dao.addCode(to,code).then(
        result => {
            return res.status(200).json();                       
        },
        error => {
            dao.updateCode(to,code).then(
                result => {
                    return res.status(200).json();                       
                },
                error => {
                    return res.status(500).send(error);
                }
            );
        }
    )
   
    res.send('The verification code has been sent to your email');
});

module.exports = email;
