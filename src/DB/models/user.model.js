import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true , "name is required"],
        lowercase: true,
        minLenght: 3,
        maxLenght: 10
    },
    gender:{
        type: String,
        required:true,
        enum: ['male' ,  'female'],
        default : 'male'
    },
    phone:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        lowercase: true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password:{
        type: String,   
        required:true,
        minLenght: 8
    }, 
    confirmed:{
        type: Boolean,
        default:false
    },
    role:{
        type : String,
        enum : ["user" , "admin"],
        default : "user"
    }

} ,{
    timestamps : true,
    versionKey : false 
})



const userModel = mongoose.models.User || mongoose.model("User" , userSchema);

export default  userModel ;