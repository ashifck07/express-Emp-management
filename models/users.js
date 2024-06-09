const mongoose = require("mongoose");


const UsersSchema =mongoose.Schema({
   userName:{
     type:String,
     required:true
   },
   Email:{
    type:String,
    required:true,
    unique:true
   },
   Password:{
    type:String,
    required:true
   }
})
  
module.exports = mongoose.model("Users",UsersSchema)