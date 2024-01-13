const userModel = require('../models/userModel')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler')
const sendJwt = require('../utils/jwt')

// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const { name, email, password, avatar } = req.body
//     const user = await userModel.create({ name, email, password, avatar })
//     sendJwt(user, 201, res)

// })

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter email & password",400))
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