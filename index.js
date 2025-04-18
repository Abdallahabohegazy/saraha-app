import dotenv from "dotenv"
import path from "path"
dotenv.config({path : path.resolve("config/.env")})
import express from 'express'
import bootsrap from './src/app.controller.js';
const app = express();
const port = process.env.PORT || 8080;

bootsrap(app , express);

app.listen(port , ()=>{
    console.log(`Example app listening on port ${port}`)
})
