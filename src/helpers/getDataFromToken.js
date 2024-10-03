import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const getDataFromToken = (req) => {
    try {
        const token = req.cookies.get("token")?.value || "";

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        return decodedToken.id;
    } catch (error) {
        console.log("error in getDataFromtoken", error);
        return NextResponse.status(500).json({ message: "Internal server error", error: error.message });
    }
}
