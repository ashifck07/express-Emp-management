 
 const Employee = require("../models/employeeModel"); 


 const getEmployees = async(page,limit,search,sortOrder)=>{
    const matchStage = {
        $match:{
            $or:[
                {firstName:{ $regex: search,$options:'i'}},
                {email:{ $regex: search,$options:'i'}},
                {country:{ $regex: search,$options:'i'}}
            ]
        }
    };
    const sortStage = { $sort: { _id: sortOrder } }; // Sort in descending order by _id
    const aggregationPipeline = [
        matchStage,
        sortStage,
        {
            $facet:{
                metadata:[{$count:'total'}],
                data:[
                    {$skip: (page-1)*limit},
                    {$limit: limit}
                ]
            }
        }
    ];
    const result = await Employee.aggregate(aggregationPipeline);
    // console.log("result",result);
    const metadata = result[0].metadata;
    const data = result[0].data;
    // console.log("metdata",metadata);
    // console.log("data is",data);
    const count = metadata.length > 0 ? metadata[0].total : 0;
    return {
        data,
        search,
        page,
        metadata,
        count,
        revdata: sortOrder 
    }
    
 }








// Function to create a new employee
const createEmployee = async (newEmp) => {
    try {
        const employee = await Employee.create(newEmp);
        return employee;
    } catch (error) {
        throw new Error(`Error in createEmployee service: ${error.message}`);
    }
};

// Function to update an employee by ID
const updateEmployee = async (id, updatedData) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedEmployee) {
            throw new Error('Employee not found');
        }
        return updatedEmployee;
    } catch (error) {
        throw new Error(`Error in updateEmployee service: ${error.message}`);
    }
};

// Function to get an employee by ID
const getEmployeeById = async (id) => {
    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            throw new Error('Employee not found');
        }
        return employee;
    } catch (error) {
        throw new Error(`Error in getEmployeeById service: ${error.message}`);
    }
};

// Function to delete an employee by ID
const deleteEmployeeById = async (id) => {
    try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            throw new Error('Employee not found');
        }
         return employee;
    } catch (error) {
        throw new Error(`Error in deleteEmployeeById service: ${error.message}`);
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    getEmployeeById,
    deleteEmployeeById,
};
