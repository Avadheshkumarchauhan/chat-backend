import {config} from "dotenv";
config({
    quiet:true,
    path:"./.env"
});
import mongodbConnection from "./src/dbs/db.connection.js"
//console.log("1 :",process);
//console.log("2 :",process.env);
const PORT =process.env.PORT;
const hostName =process.env.HOSTNAME;


import app from "./src/app.js";
import { server } from "./soket/soket.js";

try {
    await mongodbConnection();
    server.listen(PORT, async()=>{
        // await mongodbConnection();
        console.log(`Server is running at http://${hostName}:${PORT}`);
        
    });
} catch (error) {
    console.error("Server error on index file \n ",error);
    
}
