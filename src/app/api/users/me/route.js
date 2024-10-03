import { dbconnect } from "../../../../dbConfig/dbConfig";
import User from '../../../../models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from '../../../../helpers/mailer';
import { getDataFromToken } from "../../../../helpers/getDataFromToken";

dbconnect();

export async function POST(req) {
    const userId = await getDataFromToken(req);
    const user = await User.findOne({ _id: userId }).select("-password");
    // Check if there is no user
    return NextResponse.json({ message: "User found", data: user });
}
