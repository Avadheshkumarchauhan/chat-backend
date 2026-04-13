import mongoose,{Schema,model} from "mongoose";


const messageSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        
    },
    image:{
        type:String,
        
    }
},{timestamps:true});

export const Message = model("Message",messageSchema);