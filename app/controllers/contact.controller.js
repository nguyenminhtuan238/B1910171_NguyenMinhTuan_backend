const ApiError = require("../api-error")
const ContactService = require("../services/contact.service")
const MongDB = require("../utils/mongodb.util")

exports.create= async (req,res,next)=>{
    if(!req.body?.name){
        return next(new ApiError(400,"name can not be emplty"))
    }
    try {
        const contactsService=new ContactService(MongDB.client)
        const document=await contactsService.create(req.body)
        return res.send(document)
    } catch (error) {
        return next(new ApiError(500,"An error occurred while creating the contact"))
    }
}
exports.findAll=async (req,res,next)=>{
    let documents=[]
    try {
        const contactsService=new ContactService(MongDB.client)
        const {name}=req.query
        if(name){
             documents=await contactsService.findByName(name)
        }else{
             documents=await contactsService.find({})
        }
       
    } catch (error) {
        return next(new ApiError(500,"An error occurred while creating the contact"))
    }
    return res.send(documents)
}
exports.findOne=async (req,res,next)=>{
    try {
        const contactsService=new ContactService(MongDB.client)    
        const  document=await contactsService.findById(req.params.id)
        if(!document){
            return next(new ApiError(404,"Contact not found"))
        }
        return res.send(document)
    } catch (error) {
        return next(new ApiError(500,`Error retrieving contact with id=${req.params.id}`))
    }
    
}
exports.update=async (req,res,next)=>{
    if(Object.keys(req.body).length===0){
        return next(new ApiError(400,"Data to update can not be empty"))
    }
    try {
        const contactsService=new ContactService(MongDB.client)    
        const  document=await contactsService.update(req.params.id,req.body)
        if(!document){
            return next(new ApiError(404,"Contact not found"))
        }
        return res.send({message:"contact was updated successfully"})
    } catch (error) {
        return next(new ApiError(500,`Error updating contact with id=${req.params.id}`))
    }
    
}
exports.delete=async (req,res,next)=>{
    try {
        const contactsService=new ContactService(MongDB.client)    
        const  document=await contactsService.delete(req.params.id)
        if(!document){
            return next(new ApiError(404,"Contact not found"))
        }
        return res.send({message:"contact was delete successfully"})
    } catch (error) {
        return next(new ApiError(500,`could not delete contact with id=${req.params.id}`))
    }
    
}
exports.deleteAll=async (req,res,next)=>{
    try {
        const contactsService=new ContactService(MongDB.client)    
        const deleteCount=await contactsService.deleteAll()
        return res.send({message:`${deleteCount} contacts were deleted successfully`})
    } catch (error) {
        return next(new ApiError(500,"An error occurred while removing all contacts"))
    }
    
}
exports.findAllFavorite= async (req,res,next)=>{
    try {
        const contactsService=new ContactService(MongDB.client)
        const documents=await contactsService.findFavorite()
        return res.send(documents)
    } catch (error) {
        return next(new ApiError(500,"An error occurred while retrieving favorite  contact"))
    }
}