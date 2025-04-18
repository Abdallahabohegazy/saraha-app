import mongoose from "mongoose";
import { roles } from "../../middleware/auth.js";


export const  enumGender= {
    male : 'male',
    female : 'female'
}

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true , "name is required"],
        lowercase: true,
        minLenght: 3,
        maxLenght: 20,
        trim:true
    },
    gender:{
        type: String,
        required:true,
        enum: Object.values(enumGender),
        default : enumGender.male
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
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ ,
        trim:true
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
        enum : Object.values(roles),
        default : roles.user
    },
    passwordChangeAt : Date

} ,{
    timestamps : true,
    versionKey : false 
})



const userModel = mongoose.models.User || mongoose.model("User" , userSchema);

export default  userModel ;