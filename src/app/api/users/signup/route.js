import { dbconnect } from "../../../../dbConfig/dbConfig";
import User from '../../../../models/userModel';
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from '../../../../helpers/mailer';

dbconnect();

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { username, email, password } = reqBody;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("email already exist");
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log("saved user", savedUser);

        // Send verification email (assuming sendEmail function works correctly)
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        // Return success response with saved user details
        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            savedUser  // Include savedUser in the response
        }, { status: 200 });

    } catch (error) {
        // Handle errors and return appropriate error response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
