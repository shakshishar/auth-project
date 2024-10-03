import { dbconnect } from "../../../../dbConfig/dbConfig";
import User from '../../../../models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from '../../../../helpers/mailer';

dbconnect();

export async function POST(req){
    try{
        const reqBody=await req.json();
        const {token}=reqBody;

        console.log("token is",token);

        const user=await User.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}})

        if(!user){
            return NextResponse.json({error:"Invalid token details"},{status:400})
        }

        console.log("user in verify email", user);

        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, { status: 200 });

    }catch(error){
        console.log("error in verifyEmail", error);
        return NextResponse.json({ message: "error in verifyEmail" }, { status: 500 });

    }
}