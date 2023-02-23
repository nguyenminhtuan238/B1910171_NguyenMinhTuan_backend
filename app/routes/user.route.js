const express=require("express")
const users=require("../controllers/user.controller")
const router=express.Router()
router.route("/login").post(users.Login)
router.route("/register").post(users.register)
router.route("/user").post(users.tokenuser)
module.exports=router