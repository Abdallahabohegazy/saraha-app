
import { asyncHandler } from "../../utils/error/index.js";
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";


//------------------------------------------------sendMessage-----------------------------------------------
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, userId } = req.body;
  
  if(!await userModel.findOne({_id : userId })){
    return next(new Error("user not found"))
  }
  const message = await messageModel.create({ content, userId });
  return res.status(201).json({ message: "done", message });
});



//------------------------------------------------getMessages-----------------------------------------------
export const getMessages = asyncHandler(async (req, res, next) => {
  const messages = await messageModel.find({ userId: req.user._id }).populate([{
    path : 'userId' ,
    select : 'name gender' 
  }]);
  return res.status(201).json({ message: "done", messages });
});
