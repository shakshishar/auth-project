import { dbconnect } from "@/dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse,NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


dbconnect()

export async function POST(req){
    try{
        const reqBody=await req.json();
        const {username,password,email}=reqBody;

        //validation
        console.log("reqBody",reqBody);

        const user=await User.findOne({email});
        if(!user){
            return NextResponse.status(400).json({error:"user does not exist"});
        }

        console.log("user exist",user);

        const validatePassword=await bcryptjs.compare(password,user.password);
        
        if(!validatePassword){
            return NextResponse.status(400).json({error:"password is not matched"});
        }

        const tokenData={
            id:user._id,
            username:user.username,
            email:user.email
        }

        const token=await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:'1d'})
        const response = NextResponse.json({
            message:"logged in Successfully",
            success:true
        })

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response

    }catch(error){
        console.log("error in login", error);
        return NextResponse.status(500).json({error:error.message});

    }
}