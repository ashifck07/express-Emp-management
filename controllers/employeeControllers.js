const asyncHandler=require("express-async-handler");
 const Employee=require("../models/employeeModel");


 const mainHome=async(req,res)=>{
    res.render("index")
 }

 const viewPage=async(req,res)=>{
    res.render("view")
 }


// get all 
// @route get/api/contacts
// access public
const getEmployees=asyncHandler(async(req,res)=>{
    const employees=await Employee.find();
    res.status(200).json(employees)
});
  

// create  emplyee
// @route post/api/contacts
// access public
 const createEmployee=asyncHandler(async(req,res)=>{
    console.log("added Employee",req.body);
    const {   salutation,
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
    }=req.body;
    if(!salutation||!firstName||!lastName||
        !email||!phone||!userName||!password||
        !dob||!gender||!qualification||!address||
        !country||!state||!city||!pinZip
        
    )
        {
        res.status(400);
        throw new Error("all fields are mandatory !");
    }
    const employee= await Employee.create({
        salutation,
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
        
    })
    res.status(201).json(employee)
 });

 // upate  employee
// @route put/api/contacts/id
// access public
const updateEmployee=asyncHandler(async(req,res)=>{
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



// get one  
// @route get/api/contacts/id
// access public

const getEmployee=asyncHandler(async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found")
    }
    res.status(200).json(employee)
});

// deleted 
// @route delete/api/contacts/id
// access public
const deleteEmployee=asyncHandler(async(req,res)=>{
    console.log("hi")
    const employee= await Employee.findById(req.params.id);
    if(!employee){
        res.status(404);
        throw new Error("employee not found");
    }
    await Employee.deleteOne();
    res.status(200).json(employee);

})


//image post

const postavatar=async(req,res)=>{
    console.log("received files",req.file);
    console.log("requested params",req.params);
    if(req.file){
        const avatarPath=`/empImage/${req.file.file}`;
        await Employee.findByIdAndUpdate(req.params.id,{avatar :avatarPath});
        console.log('Image uploaded successfully...............');
        res.status(200).json({ message: 'Image uploaded successfully...............' });
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