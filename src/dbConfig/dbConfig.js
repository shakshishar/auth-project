import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function dbconnect(){
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo URI:", process.env.MONGO_URI);

        const connection=mongoose.connection;
        connection.on('connected',()=>{
            console.log('mongodb connected');
            
        })
        connection.on('error',(error)=>{
            console.log("mongodb connection error, please make sure db is running",error);
            process.exit();
        })
    }catch(error){
        console.log("something went wrong in db",error);
    }
}
