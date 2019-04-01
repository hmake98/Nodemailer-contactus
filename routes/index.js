var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

var readHTMLFile = function (path, callback) {
  fs.readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

router.post('/submit', (req, res) => {
  readHTMLFile(path.join(__dirname, '../templates/welcome.hbs'), function (err, html) {
    // console.log(html)
    var template = Handlebars.compile(html);;
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your username here',
        pass: 'your password here'
      }
    });

    let mailOptions = {
      from: 'rcbrcb13@gmail.com',
      to: req.body.txtEmail,
      subject: "Message from" + " " + req.body.txtName,
      html: template({name: req.body.txtName, message: req.body.txtMsg})  
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('info', 'flash added! ');
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
