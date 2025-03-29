import { youuser, channel, channelfiles } from '../Model/model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

export async function Adduser (req, res) {
  const { name, email, password } = req.body
  const duplicateUser = await youuser.findOne({ email: email })
  if (duplicateUser) {
    res.send('User exists')
    return
  }
  async function useradding () {
    try {
      const newuser = new youuser({
        name: name,
        email: email,
        password: password
      })
      await newuser.save()
      res.send('success')
    } catch (err) {
      console.log(err)
      res.send('fail')
    }
  }
  useradding()
}

export async function validLogin (req, res) {
  const { userEmail, password } = req.body

  const userfind = await youuser.findOne({ email: userEmail.toUpperCase() })
  if (!userfind) {
    res.send(null)
    return
  }
  bcrypt.compare(password, userfind.password, (err, result) => {
    if (!result) {
      res.send('incorrect password')
      return
    }
    if (result) {
      const token = jwt.sign({ user: userfind.name }, SECRET_KEY, {
        expiresIn: '10h'
      })
      res
        .cookie('Authorization', token, {
          maxAge: 9000000,
          secure: true,
          sameSite: 'None'
        })
        .json({
          token,
          message: 'success'
        })
    }
  })
}

export async function validateChannel (req, res) {
  const token = req.cookies.Authorization

  if (token) {
    const accessToken = jwt.verify(token, SECRET_KEY)

    if (!accessToken) {
      res.send('Invalid signature')
      return
    }

    if (accessToken) {
      res.send('token received')
      return
    }
  } else {
    res.send('unauthorized token')
    return
  }
}

export async function createChannel (req, res) {
  const { username, channelname } = req.body
  const newChannel = new channel({
    username: username,
    channelname
  })

  await newChannel.save()
  res.json('success')
}

export async function userVideo (req, res) {
  const username = req.headers['x-username']

  const uservideos = await channelfiles.find({ username: username })
  const videosOfuser = uservideos.map(video => ({
    video_path: video.vid_file,
    video_title: video.title
  }))

  if (!uservideos) {
    res.status(404).json({ message: 'No videos to play' })
    return
  }

  res.send(videosOfuser)
}

export async function userChannel (req, res) {
  const userName = req.headers['x-username']
  const channelCheck = await channel.findOne({ username: userName })

  if (channelCheck) {
    res.send(channelCheck.channelname)
  }
}

export async function deleteVideo(req,res) {
  const target=req.headers["x-url"]
  const user=req.headers["x-username"]
  const deleteVid= await channelfiles.deleteOne({$and:[{vid_file:target},{username:user}]})
  console.log(deleteVid)
  if(deleteVid.deletedCount==1){
    res.send("success");
    return
  }
  else{
    res.send("error")
  }
  
}