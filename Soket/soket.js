import { config } from "dotenv";
config({
    quiet:true,
    path:"./.env"
})
import http from "http";

import express from "express";
import {Server} from "socket.io"
const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:[process.env.FRONTEND_URL],
        credentials:true
    }
});

const userSocketMap ={};
export const getReceiverSocketId =(receiver)=>{
    return userSocketMap[receiver];
}
io.on("connection",(socket)=>{

    const userId = socket.handshake.query.userId;
     //console.log("UserId : ",userId);

    if(userId !=="undefined"){
        userSocketMap[userId]=socket.id;

        console.log("UserId : ",userId);
         console.log("socketId : ",socket?.id);
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    console.log(userSocketMap);   
    // io.emit("hello","Avadhesh")
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
    
});


export {app ,server,io};