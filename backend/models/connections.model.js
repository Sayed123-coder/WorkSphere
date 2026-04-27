import mongoose from "mongoose";

const connectionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:Boolean,
        default:null,
    }

 });

 const ConnectionRequest=mongoose.model("Connection",connectionSchema);

 export default ConnectionRequest;