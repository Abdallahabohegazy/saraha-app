import jwt  from "jsonwebtoken"
import userModel from "../DB/models/user.model.js"
import { asyncHandler } from "../utils/error/index.js"



export const roles ={ 
    user : 'user' ,
    admin : 'admin'
}

export const authentication = asyncHandler(async (req, res , next) =>{

    const { authorization } = req.headers

    const [prefix , token] = authorization.split(" ") || []
    if(!prefix || !token){
        return next(new Error("authentication token is required !!!!" ,{cause : 401}))
    }
    let SIGNATURE = undefined;
    if(prefix == "Admin"){
        SIGNATURE = process.env.SIGNATURE_TOKEN_ADMIN
    }else if(prefix == "Bearer"){
        SIGNATURE = process.env.SIGNATURE_TOKEN_USER
    }else {
        return next(new Error("Invalid token prefix" ,{cause : 401}))
    }

    const decoded = jwt.verify(token ,SIGNATURE) // {}
    if(!decoded?.id){
        return next(new Error("Invalid token payload" ,{cause : 403}))
    }
    const user  = await userModel.findById(decoded.id)
    if (user?.isDeleted) {
        return next(new Error("User deleted", { cause: 401 }));
      }
      if (user?.passwordChangedAt && parseInt(user?.passwordChangedAt.getTime() / 1000) > decoded.iat) {
        return next(new Error("token expire please login again", { cause: 401 }));
      }
    req.user = user
    next();
})





export const authorization = (accessRoles = []) => {
    return (req, res , next) => {
      if(!accessRoles.includes(req.user.role)){
        return next(new Error("access denied", { cause: 403 }));
      }
      next();
    };
  };