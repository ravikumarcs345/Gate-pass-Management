const express = require('express')
const multer=require('multer')
const path=require('path')
const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/user' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

const { registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateUser,
    getAllUsers,
    getOneUser,
    updateProfile,
    deleteuser
} = require('../controllers/authController')
const { isAuthenticateUser, isAuthorizeRole } = require('../middleware/authenticate')
const Router = express.Router()

Router.route('/register').post(upload.single('avatar') ,registerUser)
Router.route('/login').post(loginUser)
Router.route('/logout').get(logoutUser)
Router.route('/password/forgot').post(forgotPassword)
Router.route('/password/reset/:token').post(resetPassword)
Router.route('/password/change').put(isAuthenticateUser, changePassword)
Router.route('/myprofile').get(isAuthenticateUser, getUserProfile)
Router.route('/update').put(isAuthenticateUser,upload.single('avatar'), updateProfile)

//admin routes

Router.route('/admin/users').get(isAuthenticateUser, isAuthorizeRole('admin'), getAllUsers)
Router.route('/admin/user/:id').get(isAuthenticateUser, isAuthorizeRole('admin'), getOneUser)
    .put(isAuthenticateUser, isAuthorizeRole('admin'), updateUser)
    .delete(isAuthenticateUser, isAuthorizeRole('admin'), deleteuser)

module.exports = Router