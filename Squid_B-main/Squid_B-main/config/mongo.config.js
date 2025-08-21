import mongoose from "mongoose";

const url=process.env.MONGO_URL;
export const connectDb=async()=>{
    try{
        await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected");
    }
    catch(err){
        console.log("Db connection failed "+err);
    }
}