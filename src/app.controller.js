import { connectionDB } from "./DB/connectonDB.js";
import userRouter from "./modules/users/user.model.js";



const bootsrap = async (app , express) =>{

    app.use(express.json());
    app.use("/users" , userRouter)
    connectionDB();
    app.use("*" , (req , res , next) => {
    res.status(404).json({
        message : `invalid URL ${req.originalUrl}`
        })
    })
}  



export default bootsrap;