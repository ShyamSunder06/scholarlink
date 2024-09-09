import  jwt, { JwtPayload } from "jsonwebtoken"



export const authMiddleware=async(req:any,res:any,next:any)=>{

    const token=req.headers.authorization.split(" ")[1];
    try{
        const data=jwt.verify(token,process.env.JWT_SECRET || "student") as JwtPayload;
        console.log(data)
        req.headers.email=data.email 
        return next();
    }
    catch(err){
        console.log(err)
    }




}
