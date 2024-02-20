const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.isAuthenticateUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler("Login First to handle the resource", 401))
    }
    const deCode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(deCode.id)
    next();
})

exports.isAuthorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`This Role ${req.user.role} not Allowed to post Products`, 401))
        }
        next()
    }
}

