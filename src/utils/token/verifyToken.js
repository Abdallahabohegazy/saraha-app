
import  jwt  from "jsonwebtoken"

export const verifyToken = async ( {payload = {} , SIGNATURE , option}) => {
    return jwt.verify(
        token ,
        SIGNATURE)
}