 

 const employeemodel = require("../models/employeeModel");

 const getEmployees = async(page,limit,search)=>{
    const matchStage = {
        $match:{
            $or:[
                {firstName:{ $regex: search,$options:'i'}},
                {email:{ $regex: search,$options:'i'}},
                {country:{ $regex: search,$options:'i'}}
            ]
        }
    };
    const aggregationPipeline = [
        matchStage,
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
    const result = await employeemodel.aggregate(aggregationPipeline);
    console.log("result",result);
    const metadata = result[0].metadata;
    const data = result[0].data;
    console.log("metdata",metadata);
    console.log("data is",data);
    const count = metadata.length > 0 ? metadata[0].total : 0;
    return {
        data,
        search,
        page,
        metadata,
        count
    }
    
 }



module.exports = {
    getEmployees
}