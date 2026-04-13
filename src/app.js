import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js"
import messageRouter from "./routers/message.routes.js"
import { app } from "../socket/socket.js";
//console.log(express);


//console.log("app : ",app);
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true,
}));
app.use(morgan("dev"))

app.get("/",(req,res)=>{
    res.send("<h1>Hello chat application </h1>");
});
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/message",messageRouter);
app.use((req ,res )=>{
    res.send("<h1>Opps | 404 page not found </h1>")
})

export default app;