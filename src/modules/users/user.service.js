import userModel from "../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/error/index.js"
import { Hash , Compare  } from "../../utils/hash/index.js"
import { Encrypt ,Decrypt } from "../../utils/encrypt/index.js"
import { generateToken ,verifyToken } from "../../utils/token/index.js"
import { eventEmitter } from "../../utils/sendEmails.events/index.js"

//------------------------------------------------signUp-----------------------------------------------
export  const signUp = asyncHandler(async(req , res , next) => {
        const {name , email , password , cPassword, phone , gender} = req.body

        //check email exist or not 
        const emailExist = await userModel.findOne({email})
        if(emailExist){
            return next(new Error("Email already is exist." , {cause : 409}));
        }

        //hash password
        const hash = await Hash({key : password , SALT_ROUNDS : process.env.SALT_ROUNDS })

        //encrupt phone 
        const cipherText = await Encrypt({key : phone , SECRET_KEY : process.env.SIGNATURE_TOKEN_USER})
        //sendEmail notification
        eventEmitter.emit("sendEmail" , {email})

        // create 
        const user = await userModel.create({name , email , password:hash , phone : cipherText , gender})
        return res.status(201).json({msg : "done", user })
})



//------------------------------------------------confirmEmail-----------------------------------------------
export  const confirmEmail = asyncHandler(async(req , res , next) => {

         const {token } = req.params
        if(!token ){
            return next(new Error("token not found" , {cause : 404}));
        }
        
        const decoded =await verifyToken({token  , SIGNATURE : process.env.CONFIRMATION})
        if(!decoded?.email){
            return next(new Error("Invalid token payload" , {cause : 404}));
        }

        const user = userModel.findOneAndUpdate({email : decoded.email , confirmed : false} , {confirmed : true})
        if(!user){
            return next(new Error("user not found or already confirmed" , {cause : 400}));
        }

        return res.status(201).json({message : "done"})
})




//------------------------------------------------signIn-----------------------------------------------
export  const signIn = asyncHandler(async(req , res , next) => {

        const { email , password } = req.body

        // check email
        const user = await userModel.findOne({email , confirmed : false});
        if(!user){
            return next(new Error("invailed email or not confirmed yet" , {cause : 400}));
        }

        // check password
        const match = await Compare({key : password , hashed : user.password})
        if(!match){
            return next(new Error("invailed password" , {cause : 400}));
        }

        const token = await generateToken({
            payload : {email , id : user._id},
            SIGNATURE : user.role == "user" ? process.env.SIGNATURE_TOKEN_USER :process.env.SIGNATURE_TOKEN_ADMIN 
        })
        
        return res.status(201).json({message : "done" , token})
})




//------------------------------------------------getProfile-----------------------------------------------
export const getProfile = asyncHandler(async (req , res , next) => {
    //decrypt phone 
        req.user.phone = await Decrypt({key : req.user.phone , SECRET_KEY : process.env.SIGNATURE_TOKEN_USER})
        return res.status(201).json({message : "done" , user : req.user})
})





//------------------------------------------------updateProfile-----------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
    if (req.body.phone) {
      // encrypt phone
      req.body.phone = await Encrypt({ key: req.body.phone, SECRET_KEY: process.env.SECRET_KEY });
    }
  
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
  
    return res.status(201).json({ message: "done", user });
  });




//------------------------------------------------updatePassword-----------------------------------------------
  export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
      // check old password
      console.log("Password:", oldPassword ,  typeof oldPassword);
      console.log("Hashed:", req.user.password , typeof req.user.passsword);
      if (!await Compare({ key: oldPassword, hashed: req.user.password })) {
        return next(new Error("invalid old password", { cause: 400 }));
      }
    
      const hash = await Hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS });
      const user = await userModel.findByIdAndUpdate(req.user._id, { password: hash , passwordChangedAt : Date.now() }, { new: true });
    
      return res.status(201).json({ message: "done", user });
    });






//------------------------------------------------freezeAccount-----------------------------------------------
export const freezeAccount = asyncHandler(async (req, res, next) => {

  const user = await userModel.findByIdAndUpdate(req.user._id, { isDeleted: true, passwordChangedAt: Date.now() }, { new: true });
  
    return res.status(201).json({ message: "done", user });
});







//------------------------------------------------shareProfile-----------------------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);
  
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
  
    return res.status(201).json({ message: "done", user });
});