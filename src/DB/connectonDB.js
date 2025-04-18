
import mongoose from "mongoose";

export const connectionDB = async () => {
    await mongoose.connect(process.env.URI_ONLINE)
    .then(() => {
        console.log(`Connection to DB on URI ${process.env.URI_ONLINE}`)
    })
    .catch((err) => {
        console.log('Error connection to MongoDB' , err)
    })
}