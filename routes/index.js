var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var csrf = require("csurf");
require("dotenv").config();
// 擋外部攻擊
var csrfProtection = csrf({ cookie: true });

router.get("/", csrfProtection, function(req, res) {
  res.render("index", {
    csrfToken: req.csrfToken(),
    errors: req.flash("errors")
  });
});
router.get("/review", function(req, res) {
  res.render("contactReview");
});
router.post("/post", csrfProtection, function(req, res) {
  var data = req.body;
  if (data.username == "") {
    req.flash("errors", "姓名不可為空");
    res.redirect("/contact");
  }
  else {
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.gmailUser,
        pass: process.env.gmailPass
      }
    });
  
    var mailOptions = {
      from: "Bruce<tseng1985@gmail.com>",
      to: "tseng1985@g.ncu.edu.tw",
      subject: req.body.username + "寄了一封信",
      text: req.body.description
    };
  
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.render("error", { message: "error", error: error });
      } else {
        res.redirect("review");
      }
    });
  }
  //res.redirect('/contact/review');
});

module.exports = router;
