const {constants}=require("../constants")
const errorHandler= (err,req,res,next)=>{
    const statusCode= res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALLIDATION_ERROR:
            res.json({
                title:"not found",
                message:err.message,
                stackTrace:err.stack
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title:"vallidation",
                message:err.message,
                stackTrace:err.stack
            });
            break;
        case constants.UNAUTHORIZED_ERROR:
                res.json({
                    title:"unauthorized error",
                    message:err.message,
                    stackTrace:err.stack
                });
                break;
        case constants.FORBIDDEN:
                    res.json({
                        title:"forbidden",
                        message:err.message,
                        stackTrace:err.stack
                    });
                    break;
        case constants.SERVER_ERROR:
                        res.json({
                            title:"server error",
                            message:err.message,
                            stackTrace:err.stack
                        });
                        break;
    
        default:
            console.log(" NO ERROR,All good");
            break;
    }

};
module.exports=errorHandler;