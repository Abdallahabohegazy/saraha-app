import userModel from "../../DB/models/user.model.js"
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../service/sendEmails.js"


export  const signUp = async(req , res , next) => {
    try{
        const {name , email , password , cPassword, phone , gender} = req.body
        //check password match or not 
        if(cPassword !== cPassword){
            return res.status(400).json({msg: "password do not match "})
        }
        //check email exist or not 
        const emailExist = await userModel.findOne({email})
        if(emailExist){
            return rse.status(409).json({msg:"Email already is exist."})
        }
        //hash password
        const hash = bcrypt.hashSync(password , Number(process.env.SALT_ROUNDS))
        //encrupt phone 
        const encruptPhone = CryptoJS.AES.encrypt(phone , process.env.SIGNATURE_TOKEN_USER).toString();
        //sendEmail 
        const token = jwt.sign({email} , process.env.CONFIRMATION , {expiresIn: 60*2 }) 
        const link = `http://localhost:8080/users/confirmEmail/${token}`
    
        const emailSender =await sendEmail(email ,"Confirm Email" , `<a href='${link}'>Confirm ME</a>`)
        if(!emailSender){
            return res.status(500).json({msg : "Failed to send email "})
        }
        // create 
        const user = await userModel.create({name , email , password:hash , phone : encruptPhone , gender})
        
        return res.status(201).json({msg : "done" , user})
    }catch(error) {
        return res.status(500).json({msg:"Erorr" , message : error.message , stack: error.stack , error})
    }
}

export  const confirmEmail = async(req , res , next) => {
    try{
        const {token } = req.params

        if(!token ){
            return res.status(400).json({msg: "token not found"})
        }
        const decoded =jwt.verify(token , process.env.CONFIRMATION)

        if(!decoded?.email){
            return res.status(400).json({msg: "Invalid token payload"})
        }

        const user = userModel.findOneAndUpdate({email : decoded.email , confirmed : false} , {confirmed : true})
        if(!user){
            return res.status(400).json({msg: "user not found or already confirmed"})
        }


        return res.status(201).json({msg : "done"})
    }catch(error) {
        return res.status(500).json({msg:"Erorr" , message : error.message , stack: error.stack , error})
    }
}


export  const signIn = async(req , res , next) => {
    try{
        const { email , password } = req.body

        const user = await userModel.findOne({email , confirmed : true});
        if(!user){
            return res.status(400).json({msg : "invailed email or not confirmed yet"})
        }
        const match = bcrypt.compareSync(password , user.password)
        if(!match){
            return res.status(400).json({msg : "invailed password"})
        }

        const token = jwt.sign(
            {email, id : user._id} , 
            user.role == "user" ? process.env.SIGNATURE_TOKEN_USER :process.env.SIGNATURE_TOKEN_ADMIN ,
            {expiresIn: "1h"}
        )
        
        return res.status(201).json({msg : "done" , token})
    }catch(error) {
        return res.status(500).json({msg:"Erorr" , message : error.message , stack: error.stack , error})
    }
}


export  const getProfile = async(req , res , next) => {
    try{
        return res.status(201).json({msg : "done" , user : req.user})
    }catch(error) {
        return res.status(500).json({msg:"server erorr" , message : error.message , stack: error.stack , error})
    }
}