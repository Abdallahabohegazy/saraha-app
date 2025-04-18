
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    content:{
        type: String,
        required:true,
        minLenght: 1,
        trim:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref :"User"
    }
} ,{
    timestamps : true
});



const messageModel = mongoose.models.Message || mongoose.model("Message" , messageSchema);

export default  messageModel ;