const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const vallidateToken = asyncHandler(async(req,res,next)=>{
    let token = req.cookies.jwt;

    if(!token){
        res.render("login")
    }
    jwt.verify(token,process.env.SECRET_KEY, (err,decoded) =>{
        if(err){
            return res.status(401).render("login",{err:null});
        }
        // console.log("validate token",decoded);
        req.user = decoded.email;
        // console.log("rq user",req.user);
        next();
    })
})

module.exports = vallidateToken;