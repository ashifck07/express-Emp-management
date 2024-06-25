const { Timestamp } = require("mongodb");
const mongoose=require("mongoose");

const employeeSchema = mongoose.Schema({
    salutation:{
        type:String,
        required:[true,"salutation required"]
    },
    firstName:{
        type:String,
        required:[true,"please add the employee firstName"]
    },
    lastName:{
        type:String,
        required:[true,"please add the employee firstName"]
    },
    email:{
        type:String,
        required:[true,"please add the employee email address"]
    },
    phone:{
        type:String,
        required:[true,"please add the employee phone number"]
    },
    userName:{
        type:String,
        required:[true,"please add the employee userName"]
    },
    password:{
        type:String,
        required:[true,"please add the employee password"]
    },
    dob:{
        type:String,
        required:[true,"please add the employee dob"]
    },
    gender:{
        type:String,
        required:[true,"please add the employee gender"]
    },
    qualification:{
        type:String,
        required:[true,"please add the qualification of employee"]
    },
    address:{
        type:String,
        required:[true,"please add the qualification of employee"]
    },
    country:{
        type:String,
        required:[true,"please add the country"]
    },
    state:{
        type:String,
        required:[true,"please add the state"]
    },
    city:{
        type:String,
        required:[true,"please add the city"]
    },
    pinZip:{
        type:String,
        required:[true,"please add the pinZip"]
    },
    avatar:{
        type:String,
    },
    


    

},
{
    
        timestamps:true,
    
}
);

module.exports=mongoose.model("Employee",employeeSchema)