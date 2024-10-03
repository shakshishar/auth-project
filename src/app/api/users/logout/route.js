import { dbconnect } from "@/dbConfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dbconnect()

export async function GET(req) {
    try {
        const response = NextResponse.json({
            message: "Logout Successfully",
            success: true
        });
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        return response; // Ensure the response is returned
    } catch (error) {
        console.log("Internal server error in logout", error);
        return NextResponse.status(500).json({ message: "internal server error", error: error.message });
    }
}
