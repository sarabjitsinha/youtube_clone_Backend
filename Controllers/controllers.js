// import path from "path";
import {youuser} from "../Model/model.js";
import bcrypt from "bcryptjs";



export function Adduser(req,res){
    const {name,email,hash}=req.body;
    console.log(name,email)
    async function useradding() {
        try{
        const newuser=new youuser({name:name,email:email,password:hash});
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
   
    const {userName,psswd}=req.body;
    

    const userfind=await youuser.findOne({name:userName});
            if(!userfind)
            {
                res.send(null)
                return;
            }
            bcrypt.compare(psswd,userfind.password,(err,result)=>{
                if(err){
                    res.send("incorrect password")
                    return;
                }
                if(result)
                {
                    res.cookie('user','sarabjitfsdhere',{maxAge:900000,httpOnly:false,secure:false,path:'/'});
                     res.send('success')
                }
            })
            
        }
 

