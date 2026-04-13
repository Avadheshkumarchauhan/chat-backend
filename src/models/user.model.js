import { config } from "dotenv";
config({
    quiet:true,
    path:"./.env"
})
import {model , Schema} from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
 
const userSchema = new Schema (
    {
        name:{
            type :String,
            trim:true
        },

        userName:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,

        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        // match:[],
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        image:{
            type:String,
            default:""
        }

    
    },{timestamps:true});

    userSchema.pre("save", async function (next){
        if(!this.isModified("password")){
            return 
        }
        this.password = await bcrypt.hash(this.password,15);
        
    });
    userSchema.methods.generateToken =  function(){
        return JWT.sign(  
            {
                _id:this._id,
                userName:this.userName,
                email:this.email,
            },
            process.env.SECTERT_TOKEN,
            
            {expiresIn:process.env.EXPIRES_TOKEN_DATE}          
        );
    }
    userSchema.methods.isPasswordValid = async function (password){
        return await bcrypt.compare(password,this.password);
    }

export const User = model("User",userSchema);