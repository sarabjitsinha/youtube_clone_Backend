import {youuser,channel,channelfiles} from "../Model/model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()

const SECRET_KEY=process.env.SECRET_KEY

export function Adduser(req,res){
    const {name,email,password}=req.body;
    console.log(req.body)
    async function useradding() {
        try{
        const newuser= new youuser({name:name,email:email,password:password});
        await newuser.save();
        res.send("success")
        }
        catch (err){
            console.log(err)
            res.send("fail")
        }
        
    }
    useradding()
}


export async function validLogin(req,res){
   
    const {userName,password}=req.body;

    const userfind=await youuser.findOne({name:userName});
            if(!userfind)
            {
                res.send(null)
                return;
            }
            bcrypt.compare(password,userfind.password,(err,result)=>{
                if(!result)
                    {
                        console.log(err)
                    res.send("incorrect password")
                    return;
                }
                if(result)
                {
                    const token=jwt.sign({user:userfind.name},SECRET_KEY,{expiresIn:'10h'})
                    res.cookie("Authorization",token,{expires:new Date(Date.now()+3600000),secure:true,sameSite:"None"})
                    .json({
                        token,
                        message:"success"
                    })

                     }
            })
            
        }
 


export function validateChannel(req,res){
    const token=req.cookies.Authorization
    if(token){
       const accessToken=jwt.verify(token,SECRET_KEY)
       if(!accessToken){
        res.send("Invalid signature")
        return
       }
       if(accessToken) {    
      res.send("token received")
      return
       }
    }
    else {
      res.send("unauthorized token")
      return
    }
}

export async function createChannel(req,res){
        const {username,channelname}=req.body
        const newChannel= new channel({
            username,
            channelname
        })

        await newChannel.save();
        res.json("success")
}


// export function fileUpload(req,res){

//     const {title,category,userName}=req.body;
//     const filepath=req.file ? req.file.name:null;
    
//     const newvid=new channelfiles({
//       title:title,
//       category:category,
//       vid_file:filepath
//     });
   
//     newvid.save().then(()=>res.send("upload success in axios")).catch(()=>res.send("upload failed"))
    
// }


export async function userVideo(req,res){
        const username=req.headers["x-username"]
        console.log(username)
        const uservideos=await channelfiles.find({username:username})
        const videosOfuser=uservideos.map((video)=>video.vid_file)

        console.log(videosOfuser)
        if(!uservideos){
            res.status(404).json({message:"No videos to play"})
            return
        }
        res.send(videosOfuser)
}