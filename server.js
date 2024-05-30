const express=require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();
const path=require("path")

connectDb();

const app=express();



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.static("assets"))
const port=process.env.PORT || 5000;
app.use(express.json());

app.use("/employees",require("./routes/employeeRoutes"))
app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is runnig on ${port}`);
})