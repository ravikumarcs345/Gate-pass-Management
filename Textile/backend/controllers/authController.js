const userModel = require('../models/userModel')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendJwt = require('../utils/jwt')
const sendEmail = require('../utils/email')
const crypto = require('crypto')

// UserRegister - api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password} = req.body
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
    }
    const user = await userModel.create({ name, email, password, avatar })
    if (!user) {
        return next(new ErrorHandler("please register", 400))
    }
    sendJwt(user, 201, res)
})

//UserLogin - api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter email & password", 400))
    }
    const User = await userModel.findOne({ email }).select('+password')
    if (!User) {
        return next(new ErrorHandler("Please Enter Valid Email or Password", 401))
    }
    if (!await User.isValidPassword(password)) {
        return next(new ErrorHandler("Please Enter Valid Email or Password", 401))
    }
    sendJwt(User, 201, res)
})

//UserLogOut - api/v1/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "LoggedOut"
        })
}

//Forgot Password - api/v1/password/frgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    //creating reset token
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler('user not found with this email', 404))
    }
    const resettoken = user.getresetToken()
    await user.save({ validateBeforeSave: false })

    //creating reset url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resettoken}`
    const message = `Your password reset URL as follows \n${resetUrl}\n If you have not request to this email,then ignore it.`
    //error handeling
    try {
        sendEmail({
            email: user.email,
            subject: "sk_Textile Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    }
    catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(err.message, 500))
    }

})

//reset Password - api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    //find token and Token expire
    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })
    if (!user) {
        return next(new ErrorHandler('Reset token is invalid or expire', 500))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('password does not match', 400))
    }
    //reset the password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false })
    sendJwt(user, 201, res)
})

//Get User Profile - api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

//change password - api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user.id).select('+password')

    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('old password is invalid', 401))
    }
    //assign new password
    user.password = req.body.password
    await user.save()
    res.status(200).json({
        success: true
    })
})

//Update profile - api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
        newUserData={...newUserData,avatar}
    }
    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    })
})

//admin: get All user - api/v1/getallusers
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find()
    res.status(200).json({
        success:true,
        users
    })
})

//Admin: get Specific user - api/v1/getuser
exports.getOneUser=catchAsyncError( async(req,res,next)=>{
        const user= await userModel.findById(req.params.id)
        if(!user){
            return next(new ErrorHandler(`user not found with this id: ${req.params.id}`,404))
        }
        res.status(200).json({
            success:true,
            user
        })
})

//Admin: update user - api/v1/updateuser
exports.updateUser=catchAsyncError( async(req,res,next)=>{
        const updateuser={
            name:req.body.name,
            email:req.body.email,
            role:req.body.role
        }
        const user=await userModel.findByIdAndUpdate(req.params.id,updateuser,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            user
        })
})

//Admin: delete User - api/v1/deleteuser
exports.deleteuser=catchAsyncError(async(req,res,next)=>{
        const user=await userModel.findById(req.params.id)
        if(!user){
            return next(new ErrorHandler(`user not found with this id ${req.params.id}`,400))
        }
        await user.deleteOne()
        res.status(200).json({
            success:true
        })
})