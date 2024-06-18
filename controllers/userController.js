
const users = require("../models/users")
require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
let otp;
let currentUser;

const userSignup=async (req,res)=>{
    
    let {username,email,password} = req.body;
    currentUser = {
      username : username,
      email : email,
      password :  bcrypt.hashSync(password,10)
    };
    let user = {name:username}
    const token = jwt.sign(user,process.env.SECRET_KEY)
    console.log(token);
    otp = Math.floor(Math.random() * 9000) + 1000;
   
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // Use `true` for port 465, `false` for all other ports
          auth: {
            user: process.env.MAIL_ID,
            pass: process.env.PASS_KEY, 
          },
        });
        
        // async..await is not allowed in global scope, must use a wrapper
          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: process.env.MAIL_ID, // sender address
            to: `${email},ashifck06@gmail.com`, // list of receivers
            subject: "OTP", // Subject line
            text: "OTP", // plain text body
            html: `<b>OTP is ${otp}</b>`, // html body
          });
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          res.render("otp",{err:null});
          console.log(otp);
          
    };

 const userLogin=async(req,res)=>{
    let {email,password} = req.body;

    const response = await users.findOne({Email:email})
    // console.log(response);
    
    if(response){
        let passwordCheck= await bcrypt.compare(password,response.Password)
       passwordCheck ? res.redirect("/employees/dashboard") : ""
       if(response.Email!=email){
        let err = "invalid email";
         res.render("login",{err:err});
    }
    else if(!bcrypt.compareSync(password,response.Password)){
        let err = "invalid password";
         res.render("login",{err:err});
    }
    }else{
        let err = "invalid credential";
        res.render("login",{err:err});
    }

}
const otpVerification = async (req,res) => {
  const {currentOtp} = req.body;
  console.log(currentOtp+'    '+otp);
  console.log(currentUser);
  if(currentOtp == otp){
    let userModel = users({
      userName:currentUser.username,
      Email:currentUser.email,  
      Password:currentUser.password
  });
  
  userModel.save().then((response)=>{
    console.log(response);
    res.redirect("/user/login");
  
  })
  }else{
    res.render("otp",{err:"Invalid otp"});
  }
 
 
}
 module.exports = {
    userSignup,
    userLogin,
    otpVerification
 }

