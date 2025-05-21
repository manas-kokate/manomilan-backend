import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const connectDb = () => {
    try {
        mongoose.connect(process.env.mongoUrl);
        console.log("Db connected successfully...!")
    } catch (error) {
        console.log("Db connection error!", error)
    }
}

export default connectDb