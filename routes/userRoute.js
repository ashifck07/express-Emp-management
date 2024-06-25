const express = require("express");
const app = express();
const{ userSignup,userLogin,otpVerification,userLogout }=require("../controllers/userController")



app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup",userSignup);

app.get("/login",(req,res)=>{
    res.render("login",{err:null});
})

app.post("/login",userLogin);
app.get("/logout",userLogout);
app.post("/otp",otpVerification);


module.exports = app;

