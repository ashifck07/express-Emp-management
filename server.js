const express=require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();
const path=require("path")
const crypto = require('crypto');
// const randomBytes = crypto.randomBytes(64).toString('hex');
// console.log(randomBytes);


connectDb();

const app=express();

  

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))

app.use(express.static("assets"))
const port=process.env.PORT;
app.use(express.json());


app.use("/employees",require("./routes/employeeRoutes"))

app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is runnig on ${port}`);
})          