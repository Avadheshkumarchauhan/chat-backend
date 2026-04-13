import { User } from "../models/user.model.js";
import { apiError } from "../utills/ApiError.utill.js";
import apiResponse from "../utills/ApiResponse.js";

const option={
    httpOnly:true,
    maxAge:15*24*60*60*1000,
    secure:true,
    
}
const signUp = async (req, res) =>{
   try {
       //console.log("data : ",req?.body)
        const {userName, email,password} = req?.body;
        if(!userName || !email || !password){
            return new apiError (404,"All fiels are required ");
            
        } 
        if(password.lenght<6){
            return new apiError(404,"Password must be at least 6 character ")
        }
        const userExist= await User.findOne({
            $or:[{userName},{email}]
        });
        if(userExist){
            return new apiError(409,"User with email or userName already exist")
        }
        const user = await User.create({
            userName,email,password
        });
        if (!user) {
            return new apiError(404, "User not create in db")
            
        }
        const token =await user.generateToken();
        console.log("token : ",token);
        
        if(!token){
            return new apiError(404,"Token is not exist")
        }
        const data = await User.findById(user._id).select("-password");
        return res.status(201)
        .cookie("token",token,option)
        .json(
            new apiResponse(200,data,"User registered successfully")
        );
    } 
    catch (error) {
        console.error("Signup error on server : ",error);
        return new apiError(500,error.message); 
   }
}

const login = async(req,res )=>{
   try {
       //console.log("body : ",req?.body);
     const {email ,password} = req?.body;
     
 
     if(!email || !password){
         return new apiError (404,"All fiels are required ");
         
     } 
     const user = await User.findOne({email});
     if(!user){
         return new apiError(404,"User  does not exist")
     }
     const isPasswordCorrect= await user.isPasswordValid(password);
     //console.log(isPasswordCorrect);
 
     if (!isPasswordCorrect) {
         return new apiError(401,"Password does not match");        
     }
     const token =await user.generateToken();
     console.log("token : ",token);
     
     if(!token){
          return new apiError(404,"Token does not exist")
     }
     user.password=undefined;
     return res.status(200).
     cookie("token",token,option)
     .json(new apiResponse(200,user,"User login successfully"));
    } 
   catch (error) {
    console.log("Server error login page : ",error);
    return new apiError(500,error.message);    
   } 

}
const logOut = async (req, res ) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
        return new apiError(401,"invalid token please login")
        }
        return res.status(200).clearCookie("token",{httpOnly:true,secure:true,maxAge:0})
        .json(new apiResponse(200,{},"User logout successfully"))

    } catch (error) {
        console.error("server error logout page : ",error);
        return new apiError(500,error.message)
        
    }
}


export {
    signUp,
    login,
    logOut,
    

}