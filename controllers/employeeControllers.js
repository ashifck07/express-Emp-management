const asyncHandler = require("express-async-handler");
 const Employee = require("../models/employeeModel");
 const fs = require("fs");
 const path = require("path");
const employeeServices = require("../services/employeeServices");


 const mainHome = async(req,res)=>{
    res.render("index")
 }

 const viewPage = async(req,res)=>{
    res.render("view")
 }


// get all employee
const getEmployees = asyncHandler(async(req,res)=>{
   try {
    const page = parseInt(req.query.page) ||1;
    const limit = parseInt(req.query.limit) ||5;
    const search = req.query.search ||'';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const result = await employeeServices.getEmployees(page,limit,search,sortOrder);
 



     return res.status(200).json(
        {
            data:result.data,
            search:result.search,
            page:result.page,
            count:result.count,
            revdata: result.revdata // Pass sortOrder to the frontend
        }
    );

    
   } catch (error) {
    return res.status(400).json({
        success: false,
        msg: error.message
      });
   }
});
  

// create  emplyeee

 const createEmployee = asyncHandler(async(req,res)=>{
    const newEmp = {   salutation,
        firstName,
        lastName,
        email,
        phone,
        userName,
        password,
        dob,
        gender,
        qualification,
        address,
        country,
        state,
        city,
        pinZip,
    } = req.body;
    if(!newEmp)
        {
        res.status(400);
        throw new Error("all fields are mandatory !");
    }
    const employee = await Employee.create(newEmp)
    res.status(201).json(employee)
 });

 // update  employee

const updateEmployee = asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not  found");
    }
    const upadtedEmployee=await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
   
    res.status(200).json(upadtedEmployee);
});

// get one employee

const getEmployee = asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found")
    }
    res.status(200).json(employee)
});

// delete emplyeee

const deleteEmployee = asyncHandler(async(req,res)=>{
    const employee = await Employee.findByIdAndDelete(req.params.id);
   
    if(!employee){
        res.status(404);
        throw new Error("employee not found");
    }
   const imagePath = path.join(__dirname,"..","assets","empImage", `${req.params.id}.png`);
   fs.unlinkSync(imagePath);
    res.status(200).json(employee);
})

//image post

    
    
    const postavatar = async(req,res)=>{
    console.log("received files",req.file);
    console.log("requested params",req.params);
    if(req.file){
        const avatarPath=`${req.file.filename}`;
        console.log("avather path is :",avatarPath);
        console.log("filenames are :",req.file.filename);
        await Employee.findByIdAndUpdate(req.params.id,{avatar :avatarPath})

            console.log('Image uploaded successfully...............');
            res.status(200).json({ message: 'Image uploaded successfully...............'});
        
    }else{
        console.log('No file uploaded');
        res.status(400).json({ message: 'Failed to upload image...............' });
    }
}



module.exports={
    getEmployees,
    deleteEmployee,
    getEmployee,
    updateEmployee,
    createEmployee,
    mainHome,
    postavatar,
    viewPage,

};