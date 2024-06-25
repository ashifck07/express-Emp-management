const asyncHandler = require("express-async-handler");
 const Employee = require("../models/employeeModel");
 const fs = require("fs");
 const path = require("path");
 const employeeService = require("../services/employeeServices");

 const mainHome = async(req,res)=>{
    res.render("index")
 }

 const viewPage = async(req,res)=>{
    res.render("view")
 }


// Get all employees
const getEmployees = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const result = await employeeService.getEmployees(page, limit, search, sortOrder);

    return res.status(200).json({
        data: result.data,
        search: result.search,
        page: result.page,
        count: result.count,
        revdata: result.revdata,
    });
});

// Create employee
const createEmployee = asyncHandler(async (req, res) => {
    const newEmp = req.body;

    if (!newEmp) {
        return res.status(400).json({ success: false, msg: 'All fields are mandatory!' });
    }

    const employee = await employeeService.createEmployee(newEmp);
    res.status(201).json(employee);
});

// Update employee
const updateEmployee = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedEmployee = await employeeService.updateEmployee(id, updatedData);
    res.status(200).json(updatedEmployee);
});

// Get employee by ID
const getEmployee = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const employee = await employeeService.getEmployeeById(id);
    res.status(200).json(employee);
});

// Delete employee by ID
const deleteEmployee = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deletedEmployee = await employeeService.deleteEmployeeById(id);
    res.status(200).json(deletedEmployee);
});




//image post

    
    
    const postavatar = async(req,res)=>{
    console.log("received files",req.file);
    console.log("requested params",req.params);
    if(req.file){
        const avatarPath=`${req.file.filename}`;
        // console.log("avather path is :",avatarPath);
        // console.log("filenames are :",req.file.filename);
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