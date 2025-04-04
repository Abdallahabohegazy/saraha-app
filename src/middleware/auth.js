import jwt  from "jsonwebtoken"
import userModel from "../DB/models/user.model.js"

export const authentication = async (req, res , next) =>{
    try{
        const { authorization } = req.headers

        const [prefix , token] = authorization.split(" ") || []
        if(!prefix || !token){
            return res.status(401).json({msg : "token not found"})
        }
        let SIGNATURE = undefined;
        if(prefix == "admin"){
            SIGNATURE = process.env.SIGNATURE_TOKEN_ADMIN
        }else if(prefix == "bearer"){
            SIGNATURE = process.env.SIGNATURE_TOKEN_USER
        }else {
            return res.status(401).json({msg : "Invalid token prefix"})
        }

        const decoded = jwt.verify(token ,SIGNATURE) // {}
        if(!decoded?.id){
            return res.status(401).json({msg : "Invalid token payload"})
        }
        const user  = await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({msg : "user not found !!"})
        }
        req.user = user
        next();
    } catch (error){
        if(error?.name == "JsonWebTokenError" || error?.name == "TokenExpiredError"){
            return res.status(401).json({msg : "Invalid token "})
        }
        return res.status(500).json({msg:"server erorr" , message : error.message })
    }
}