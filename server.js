
// /* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Adduser,validLogin } from "./Controllers/controllers.js";
// import { youuser } from "./Model/model.js";
import * as dotenv from "dotenv"
import multer from "multer";
import path from "path"
import { channelFiles } from "./Model/model.js";
import cookieParser from "cookie-parser"


// const upload=multer({dest:"uploads/"})

// const DB_PASSWORD=process.env.DB_PASSWORD
// mongoose.connect(`mongodb+srv://sinhasarabjit:${DB_PASSWORD}@cluster0.mnfd3.mongodb.net/test`)

mongoose.connect("mongodb://127.0.0.1:27017/")

const db=mongoose.connection;

db.on('open',()=>{
    console.log("database connected");
})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null, 'mongodb://127.0.0.1:27017/test')
      cb(null, '../uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname) 
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

dotenv.config()
const app=new express();

app.use(express.json())
app.use(cors());
app.use(cookieParser())

app.listen(3000,()=>{
    console.log("server started");
    
})

// function setcookie(req,res,next){
//   res.cookie('user','sarabjitfsdhere',{maxAge:90000,httpOnly:true});
  
//   next();
// }

// app.post('/uploads',upload.single('file'),(req,res)=>{ 
// res.send("upload success")
// })


app.post('/uploads',upload.single('file'),(req,res)=>{
    const {title,category}=req.body;
    const filepath=req.file ? req.file.path:null;
    const newvid=new channelFiles({
      title:title,
      category:category,
      vid_file:filepath
    });
   
    newvid.save().then(()=>res.send("upload success in axios")).catch(()=>res.send("upload failed"))
    
})




app.post('/register',Adduser);

app.post('/signin',validLogin)



