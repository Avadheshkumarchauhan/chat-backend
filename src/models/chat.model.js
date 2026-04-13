import mongoose, {Schema,model} from "mongoose";

const conversetionSchema = new Schema({
    participants:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    message:[
        {
            type:Schema.Types.ObjectId,
            ref:"Message"
        }
    ]

},{timestamps:true}) ;

 export const Chat  =model("Chat",conversetionSchema);