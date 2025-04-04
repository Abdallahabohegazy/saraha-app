
import mongoose from "mongoose";

export const connectionDB = async () => {
    await mongoose.connect(process.env.URI_CONNECTION)
    .then(() => {
        console.log('connected to mongoDB')
    })
    .catch((err) => {
        console.log('Error connection to mongoDB' , err)
    })
}