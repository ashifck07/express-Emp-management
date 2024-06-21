 

 const employeemodel = require("../models/employeeModel");

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
    const result = await employeemodel.aggregate(aggregationPipeline);
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
        revdata: sortOrder // Include sortOrder in the response
    }
    
 }



module.exports = {
    getEmployees
}