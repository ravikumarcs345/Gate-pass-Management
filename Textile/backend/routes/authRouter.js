const express=require('express')
const { loginUser } = require('../controllers/authController')
const Router=express.Router()

// Router.route('/register').post(registerUser)
Router.route('/login').post(loginUser)
module.exports=Router