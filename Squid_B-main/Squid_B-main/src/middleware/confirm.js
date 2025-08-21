export const confirmPasswords=(req,res,next)=>{
    if(req.body.password!=req.body.confirmPassword){
        res.send({status:false,message:"Password and Confirm Password don't match"});
    }
    else next();
}