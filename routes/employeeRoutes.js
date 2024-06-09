const upload=require("../middleware/multer")
const express=require("express");
const router=express.Router();
const app = express();
const users=require("../models/users")
const dotenv=require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const {
    getEmployees,
    deleteEmployee,
    getEmployee,
    updateEmployee,
    createEmployee,
    mainHome,
    postavatar,
    viewPage,
    test
                    }=require("../controllers/employeeControllers");

// router.route("/dashboard").get(mainHome);
// router.route("/view.html?").get(viewPage);
app.get("/dashboard",mainHome);
app.get("/view.html?",viewPage);
app.get("/signup",test)

app.post("/signup",(req,res)=>{
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
          res.redirect("/employees/login")
        })
       }
        
    })


})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async(req,res)=>{
    console.log("zzz");
    let {email,password} = req.body;

    const response = await users.findOne({Email:email})
    console.log(response);

    if(response){
       let passwordCheck= await bcrypt.compare(password,response.Password)
       passwordCheck ? res.redirect("/employees/dashboard") : ""
    }

})

app.get("/",getEmployees);
app.get("/:id",getEmployee);  
app.put("/:id",updateEmployee);
app.post("/",createEmployee);
app.delete("/:id",deleteEmployee);


// router.route("/").get(getEmployees).post(createEmployee);
// router.route("/:id").get(getEmployee).put(updateEmployee).delete(deleteEmployee)

app.post("/:id/avatar",upload.single("avatar"),postavatar)

module.exports=app;