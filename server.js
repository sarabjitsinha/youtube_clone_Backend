
// /* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Adduser,
  validLogin,
  validateChannel,
  createChannel,
  userVideo,
  userChannel,
  deleteVideo 
}
   from "./Controllers/controllers.js";
import * as dotenv from "dotenv"
import cookieParser from "cookie-parser"
import upload from "./upload.js";
import { channelfiles } from "./Model/model.js";
dotenv.config()

const PORT=process.env.PORT || 3000
const DB_PASSWORD=process.env.DB_PASSWORD

const app=new express();

app.use(express.json())

app.use('/uploads',express.static('public'));

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}));

app.use(cookieParser())

app.listen(PORT,()=>{
    console.log("Server started on Port :",PORT);
    
})


mongoose.connect(`mongodb+srv://sinhasarabjit:${DB_PASSWORD}@cluster0.mnfd3.mongodb.net/`)


const db=mongoose.connection;

db.on('open',()=>{
    console.log("Database Connected");
})

app.post('/register',Adduser);

app.post('/signin',validLogin)

app.get('/channel',validateChannel)

app.post('/addchannel',createChannel)

app.get('/channelvideo',userVideo)

app.get('/channelname',userChannel)

app.post('/upload',upload.single('file'),(req,res)=>{

  const {title,category}=req.body;
  const username=req.headers['x-username' || 'unknown-user']
  const fileUrl=`${req.protocol}://${req.get('host')}/uploads/${username}/${req.file.filename}`
  const newvid=new channelfiles({
    username:username,
    title:title,
    category:category,
    vid_file:fileUrl
  });
 
  newvid.save().then(()=>res.send("upload success")).catch(()=>res.send("upload failed. Please select a Category/Title"))
  
})

app.delete("/delete",deleteVideo)