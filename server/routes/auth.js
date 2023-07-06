const express=require('express')
const mongoose = require('mongoose')
const router=express.Router()
const User=mongoose.model('User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const requireLogin=require('../middleware/requireLogin')
const nodemailer=require('nodemailer')
const crypto=require('crypto')

const sendgridTransport=require("nodemailer-sendgrid-transport")
const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))
router.get('/',(req,res)=>{
    res.send('Hello')
})
router.get('/protected',requireLogin,(req,res)=>{
    res.send('Hello world')
})
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                  email,
                  password:hashedpassword,
                  name,
                  pic
              })
      
              user.save()
              .then(user=>{
                  transporter.sendMail({
                      to:user.email,
                      from:"srinath.depression@gmail.com",
                      subject:"signup success",
                      html:"<h1>welcome to  JUC instagram</h1>"
                  })
                  res.json({message:"saved successfully"})
              })
              .catch(err=>{
                  console.log(err)
              })
        })
       
    })
    .catch(err=>{
      console.log(err)
    })
  })
router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password ){
       return  res.status(422).json({error:"Please fill up all the fields"})
    }
    User.findOne({email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422),json({err:"Invalid Email or Password"})
        }

        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
            // return    res.json({message:"Successfully signed in"})
                const token=jwt.sign({id:savedUser.id},JWT_SECRET)
                const{ _id,name,email,followers,following,pic}=savedUser
                res.json({token, user:{_id,name,email,followers,following,pic}})

            }else{
                return res.status(422).json({err:"Error in connecting to Database"})
            }

        }).catch(err=>{
            console.log(err)
        })
        
        
       
    }).catch(err=>{
        console.log(err)
    })
})
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"srinath.depression@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/search-users',(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email name")
    .then(user=>{
        
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})
module.exports=router