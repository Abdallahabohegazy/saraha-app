import cors from "cors"
import { connectionDB } from "./DB/connectonDB.js";
import messageRouter from "./modules/messages/message.controller.js";
import userRouter from "./modules/users/user.model.js";
import { globalErrorHandling } from "./utils/error/index.js";

const bootsrap = async (app , express) =>{
    //use cors middleware
    app.use(cors())


    //use json middleware for parsing request data
    app.use(express.json());


    //home route 
    app.get("/" , (req ,res , next ) => {
        return res.status(200).json(" Hello on sara7a app")
    })

    //application routes
    app.use("/users" , userRouter)
    app.use("/messages" , messageRouter)

    //connect to dataBase
    connectionDB();

    //unhandle routes
    app.use("*" , (req , res , next) => {
        return next(new Error( `invalid URL ${req.originalUrl}`))
    })

    //error handling meddileware [gloabal error handler]
    app.use(globalErrorHandling)
}  



export default bootsrap;