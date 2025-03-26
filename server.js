
// /* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Adduser,
  validLogin,
  validateChannel,
  createChannel,
  fileUpload,
  userVideo 
}
   from "./Controllers/controllers.js";
import * as dotenv from "dotenv"
import cookieParser from "cookie-parser"
import upload from "./upload.js";
dotenv.config()

const PORT=process.env.PORT || 3000
const DB_PASSWORD=process.env.DB_PASSWORD

const app=new express();

app.use(express.json())

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

app.use(cookieParser())

app.listen(PORT,()=>{
    console.log("Server started on Port :",PORT);
    
})


mongoose.connect(`mongodb+srv://sinhasarabjit:${DB_PASSWORD}@cluster0.mnfd3.mongodb.net/`)

// mongoose.connect("mongodb://127.0.0.1:27017/")

const db=mongoose.connection;

db.on('open',()=>{
    console.log("Database Connected");
})

app.post('/uploads',upload.single('file'),fileUpload)

app.post('/register',Adduser);

app.post('/signin',validLogin)

app.get('/channel',validateChannel)

app.post('/addchannel',createChannel)

app.get('/channelvideo',userVideo)