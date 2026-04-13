import { config } from "dotenv";
import { apiError } from "../utills/ApiError.utill.js";
config({quiet:true,
    path:"./.env"
});
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next )=>{
    try {
        
        const {token} = req.cookies || req.header("Authorization")?.replace("Bearer ", "");
       
       // console.log("token midd : ",token);
        
        
        if(token ===undefined){
            return new apiError(401,"Unauthorized error please login");
        }
    
        const decodedToken = await jwt.verify(token,process.env.SECTERT_TOKEN);
      //  console.log("verify : ",decodedToken);
        
        req.user =decodedToken;
               
        next();
    } catch (error) {
        console.error("Server error on authmiddleware : ",error);
        return new apiError(500,error.message)
        
    }
}

export {verifyJwt};