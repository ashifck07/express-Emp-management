
const users=require("../models/users")
const dotenv=require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")



const userSignup=((req,res)=>{
    
    let {username,email,password} = req.body;
    let user = {name:username}
    const token = jwt.sign(user,process.env.SECRET_KEY)
    console.log(token);
    bcrypt.hash(password,10,function(err,hashedPassword){

       if(err){
         console.log(err);
       }else{
        console.log(hashedPassword);
        let userModel = users({
            userName:username,
            Email:email,  
            Password:hashedPassword
        })
        userModel.save().then((response)=>{
          console.log(response);
          res.redirect("/user/login")
        })
       }
          
    })
   
 });

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

 
 module.exports = {
    userSignup,
    userLogin
 }

