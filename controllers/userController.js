
const users = require("../models/users")
require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
let otp;
let currentUser;

const userSignup=async (req,res)=>{
    
    let {username,email,password} = req.body;
    console.log(req.body);
    currentUser = {
      username : username,
      email : email,
      password :  bcrypt.hashSync(password,10)
    }; 
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
        
          const info = await transporter.sendMail({
            from: process.env.MAIL_ID, // sender address
            to: `${email},ashifck06@gmail.com`, // list of receivers
            subject: "OTP", // Subject line
            text: "OTP", // plain text body
            html: `<b>OTP is ${otp}</b>`, // html body
          });
          res.render("otp",{err:null});
          console.log(otp);
          
};

 const userLogin=async(req,res)=>{
    let {email,password} = req.body;

    const response = await users.findOne({email:email});
    
    if(response){
     if(!bcrypt.compareSync(password,response.password)){
        let err = "invalid password";
         res.render("login",{err:err});
    
    }else{
      let user = {email:email}
    const token = jwt.sign(user,process.env.SECRET_KEY)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 30 * 60 * 1000 }); 
    return res.redirect("/employees/dashboard");
    // res.cookie("jwt",token).redirect("/employees/dashboard");

    }
  }else{

    let err = "invalid credential";
    res.render("login",{err:err});
  }  
  
}

const userLogout = (req, res) => {
  res.clearCookie("jwt");  // Clear the JWT cookie
  res.redirect("/user/login");  // Redirect to the login page
};

const otpVerification = async (req,res) => {
  const {currentOtp} = req.body;
  console.log(currentUser);
  // console.log(currentOtp+'    '+otp);
  // console.log(currentUser);
  if(currentOtp == otp){
    let userModel = users({
      userName:currentUser.username,
      email:currentUser.email,  
      password:currentUser.password
  });
  
  userModel.save().then((response)=>{
    // console.log(response);
    res.redirect("/user/login");
  
  })
  }else{
    res.render("otp",{err:"Invalid otp"});
  }
}


 module.exports = {
    userSignup,
    userLogin,
    otpVerification,
    userLogout,
    
 }

