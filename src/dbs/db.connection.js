import { config } from "dotenv";
config({
    quiet:true,
    path:"./.env"
})

import mongoose from "mongoose";
const mongodbString = process.env.MONGODB_URL;
//console.log("mongoose : ",mongoose);


const dbConnection = async()=>{
    try {

        const instanceDB = await mongoose.connect(mongodbString);
        console.log("MongoDB connected successfully\nHostName : ",instanceDB.connection.host);
       // console.log("instance : ",instanceDB);
      //  console.log("instance conection : ",instanceDB.connection);
               
        

        
    } catch (error) {
        console.error("MongoDB conection failed \n",error);
        process.exit(1);
        
    }
}

export default dbConnection;