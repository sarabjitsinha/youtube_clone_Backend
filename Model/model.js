// import { Password } from "@mui/icons-material";
import mongoose from "mongoose";


const user= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    }
)

export const youuser=mongoose.model('youuser',user);




const channelSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    channelname:{
        type:String,
        required:true
    }
})

export const channel= mongoose.model("channel",channelSchema);

const clFiles= new mongoose.Schema({
    title:{
        type:String,
        required:true},
     category:{
        type:String,
        required:true
     } ,
     vid_file:String  
    
})

export const channelfiles= mongoose.model('channelfile',clFiles);