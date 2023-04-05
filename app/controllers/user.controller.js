const ApiError = require("../api-error")
const UserService = require("../services/user.service")
const MongDB = require("../utils/mongodb.util")
require('dotenv').config()
const jwt=require('jsonwebtoken')
exports.Login= async (req,res,next)=>{
    if(!req.body?.username || !req.body?.password){
        return next(new ApiError(401,"Username or Password can not be emplty"))
    }try{
        const usersService=new UserService(MongDB.client)
        const user= await usersService.finduser(req.body.username)
        const passwordValid= await usersService.findpass(req.body.username,req.body.password)
        if(!user){
            return next(new ApiError(401,"incorrect  username or password"))  
        }
         if(!passwordValid){
            return next(new ApiError(401,"incorrect  username or password"))  
        }
        const accessToken=jwt.sign({user:user.username},process.env.ACCESS_TOKEN)
        return res.json({message:"login in successfully",accessToken})
    }catch(error){
        console.log(error)
        return next(new ApiError(500,"  internal server error"))
    }
    
}
exports.register=async(req,res,next)=>{
    if(!req.body?.username || !req.body?.password){
        return next(new ApiError(401,"Username or Password can not be emplty"))
    }
    try {
        const usersService=new UserService(MongDB.client)
        const user=await usersService.finduser(req.body.username)
        if(!user){
            await usersService.register(req.body)
            const accessToken=jwt.sign({user:req.body.username},process.env.ACCESS_TOKEN)
            return res.json({message:"Create  account success",accessToken})
        }else{
            return next(new ApiError(401,"username already exists"))
        }
    } catch (error) {
        console.log(error)
        return next(new ApiError(500,"internal server error"))
    }
}
exports.tokenuser=async (req,res,next)=>{
    const token=req.body.token
    if(!token){
        return next(new ApiError(401,"Access token not found"))
    }
    try {
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN)
        return res.json(decoded)
    } catch (error) {
        console.log(error)
        return next(new ApiError(500,"internal server error"))
    }
}