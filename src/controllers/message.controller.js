import { getReceiverSocketId, io } from "../../socket/socket.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { apiError } from "../utills/ApiError.utill.js";
import apiResponse from "../utills/ApiResponse.js";
import { uploadOnCloudinary } from "../utills/cloudinary.utill.js";


const sendMessage =async (req, res)=>{
    try {

        const senderId =req?.user?._id;
        const {receiverId}=req?.params;
        if(receiverId==="undefined"){
            return new apiError(400,"receiver id not send please selecet user");
        }
        let message ="";
        let image ="";
        if(req?.body){
            message=req?.body?.message

        }
                
        if(req?.file){
            const {path}=req?.file;
            console.log("path",path);
            
            if(!path){
                return new apiError(400,"Image not send to fromtend");
            }

            image = await uploadOnCloudinary(path);
            if(!image?.url){
                return new apiError(400, "file uploding error on cloudinary");
            }

        }
      //  console.log("sender/receiver ",senderId," : ",receiverId);
        let converSetion = await Chat.findOne({
            participants:{$all:[senderId,receiverId]}
        });
        const newMessage = await Message.create({
            sender:senderId,receiver: receiverId , message:message, image:image?.url
         
        })

        if(!converSetion){
            converSetion = await Chat.create({
                participants:[senderId,receiverId],
                message:[newMessage?._id]
            })

        }
        else{
            converSetion.message.push(newMessage?._id);
            await converSetion.save({validateBeforeSave:false});
        }

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
           // console.log("rec socket : ",receiverSocketId);
            
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
       // console.log("message socket : ",newMessage);
        
        return res.status(201).json
        (new apiResponse(201 ,newMessage,"Send message successfully"));

        
    } catch (error) {
        console.error("Message server Error : ",error);
        return new apiError(500, error.message);
        
    }

} 
const getMessage =async (req, res)=>{
    try {
        const senderId =req?.user?._id;
        const {receiverId}=req?.params;
        
        if(receiverId==="undefined"){
            return new apiError(400,"receiver id not send please selecet user");
        }
        
        const  converSetion = await Chat.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("message");
                
        if(!converSetion?.message){
            //return new apiError(400,"Message not found");
            return res.status(200).json(new apiResponse(200, []," Message is empty"));
        }
               
        return res.status(200).json(new apiResponse(200, converSetion?.message," Receive message successfully"));


    } catch (error) {
        console.error("Message get server Error : ",error);
        return new apiError(500, error.message);
        
    }

} 


export {
    sendMessage,
    getMessage,

}