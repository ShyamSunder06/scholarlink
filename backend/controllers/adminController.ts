import { PrismaClient } from "@prisma/client"
const prisma=new PrismaClient();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const createToken = (email:any)=>{
    let token= jwt.sign({id:email},process.env.JWT_SECRET || "student");
    return `Bearer ${token}`
}

export const adminReg=async(req:any,res:any)=>{
    try{
        const {email,password,orgname}=req.body
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);

        const admin=await prisma.admin.create({
            data:{
                email,
                password:hashedPass,
                orgname
            }
        })
        const token=createToken(admin.email)

        return res.status(200).json({token})



    }
    catch(err)
    {
        return res.status(500).json({msg:"error"})
    }

}

export const adminLogin=async(req:any,res:any)=>{
    try{

    const {email,password}=req.body
    const admin=await prisma.admin.findUnique({
        where:{
            email
        }
    })
    if(!admin)
    {
        return res.status(500).json({msg:"error"})
    }
    const verifyPass = await bcrypt.compare(password,admin.password);
    if(!verifyPass){
        return res.status(500).json({message:"Invalid Password"})
    }

    const token=createToken(email);
    return res.status(200).json({token})

}
catch(err){
    console.log(err)
    return res.status(500).json({msg:"errors"})
}

}


export const createScholarship = async(req:any,res:any)=>{
    try{

    const {name,scholarshipfor,amt,regstdate,regenddate,description,procedures} =req.body;
    console.log(req.body)

    const scholarship=await prisma.scholarship.create({
        data:{
            name,
            providedby:1,
            scholarshipfor,
            likes:0,
            amt,
            regstdate,
            regenddate,
            description,
            procedures


        }
    })
    return res.status(200).json({msg:"done"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({msg:"eroor"})
    }
}

export const registeredApplicants = async(req:any,res:any) =>{
    try{
        const {scholarshipId} = req.body;
        const registered = await prisma.scholarshipApplied.findMany({
            where:{
                scholarshipid:scholarshipId
            },select:{
                student:{
                    select:{
                        name:true,
                        email:true,
                        studentdetails:{
                            select:{
                                currentQualifications:true,
                                gender:true,
                                annualIncome:true,
                                dob:true,
                                bonafide:true,
                                incomecertificate:true,
                                salaryslip:true,
                                achievements:true
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json({students:registered})
    }catch(err){
        console.log(err);
        res.status(500).json({message:err})
    }
}