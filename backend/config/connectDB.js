import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({path:"../.env"})
const connectDB= async()=>{
    try{
        const connection=mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongodb connected successfully`)
    }
    catch(error){
        console.error("mongodb connection error",error.message)
    }
}
export default connectDB;