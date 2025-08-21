import {app} from "./server.js"
import { connectDb } from "./config/mongo.config.js"

const PORT=process.env.PORT || 3000;

app.listen(PORT,async(err)=>{
  if(err) console.log(err);
  else{
    await connectDb();
    console.log("Server is active");
    console.log("Port: ",PORT);
  }
})