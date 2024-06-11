const express = require("express");
const app = express();
const{ userSignup,userLogin }=require("../controllers/userController")







app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup",userSignup)

app.get("/login",(req,res)=>{
    res.render("login",{err:null});
})

app.post("/login",userLogin)


module.exports = app;

