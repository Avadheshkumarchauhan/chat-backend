import { User } from "../models/user.model.js";
import { apiError } from "../utills/ApiError.utill.js";
import apiResponse from "../utills/ApiResponse.js";
import { uploadOnCloudinary } from "../utills/cloudinary.utill.js";

const getUser = async (req, res ) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
        return new apiError(401,"invalid token please login")
        }
        return res.status(200)
        .json(new apiResponse(200,user,"Get user successfully"))

    } catch (error) {
        console.error("server error get  : ",error);
        return new apiError(500,error.message)
        
    }
}
const updateProfile = async( req,res)=>{
    try {
        const {name} =req?.body;
        let image="";
        console.log("name: ",name);
        

        if(!name){
            return new apiError(400,"Name is required ");
        }
        if(req?.file){
            const {path} = req?.file;
            console.log("path: ",path);
            
            if(!path){
                return new apiError(400, "Image is reqiured");
            }
            image= await uploadOnCloudinary(path);
            console.log("image ",image);
            

            if(!image?.url){
                return new apiError(404,"cloudinary uploading error");
    
            }
        }
         const user = await User.findById(req.user._id).select("-password");
        if(!user){
        return new apiError(401,"invalid token please login");
        }
        user.name=name;
        user.image=image.url;
        await user.save({validateBeforeSave:false});
        res.status(200).json(new apiResponse(200, user,"Update user details successfully "))
        
    } catch (error) {
        console.error("server error edit  : ",error);
        return new apiError(500,error.message)
        
        
    }

}
const getOtherUsers=async (req, res)=>{
    try {
        const user = await User.find({
            _id:{$ne :req?.user?._id}
        }).select("-password");

        if(!user){
        return new apiError(401,"invalid token please login")
        }
        return res.status(200).
        json(new apiResponse(200,user,"Users fetch successfully"));
        
    } catch (error) {
        console.error("server error other users  : ",error);
        return new apiError(500,error.message)        
    }
}

const searchUser = async(req, res)=>{
    try {
        const {query} =req.query;

        if(query ==="undefined"){
            return new apiError(400,"query not send please try again");
        }
        
        const user = await User.find({
            $or:[
                {name:{$regex:query, $options:"i"}},
                {userName:{$regex:query, $options:"i"}}
            ]
        });
        if(!user){
            return new apiError(400,"user not register");
        }

        return res.status(200).
        json(new apiResponse(200,user,"User search successfully"));
    } 
    catch (error) {
        console.error("server error search users  : ",error);
        return new apiError(500,error.message) ;       
    
    }
}

export {
    getUser,
    updateProfile,
    getOtherUsers,
    searchUser
}