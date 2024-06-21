const upload=require("../middleware/multer")
const express=require("express");
const router=express.Router();
const app = express()
const vallidateToken = require("../middleware/vallidateTokenHandler")
const { getEmployees, deleteEmployee, getEmployee, updateEmployee, createEmployee,   mainHome,   postavatar,   viewPage}=require("../controllers/employeeControllers");

app.get("/dashboard",vallidateToken,mainHome);
app.get("/view.html?",viewPage);
app.get("/",getEmployees);
app.get("/:id",getEmployee);  
app.put("/:id",updateEmployee);
app.post("/",createEmployee);
app.delete("/:id",deleteEmployee);  




app.post("/:id/avatar",upload.single("avatar"),postavatar)

module.exports=app;