const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const path = require("path")
const userRoute = require("./routes/userRoute")
const app = express();
// const session = require("express-session")
const cookieParser = require("cookie-parser")
const port=process.env.PORT;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.static("assets"))
app.use(express.json());
app.use(cookieParser())
connectDb();


app.use("/employees",require("./routes/employeeRoutes"))
app.use("/user",userRoute)

app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server is runnig on ${port}`);
})    

    





