import mongoose from 'mongoose'
import config from '../config/config.js'

const connectDB=async()=>{
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Error connecting to database",err);
    }
}
export default connectDB;