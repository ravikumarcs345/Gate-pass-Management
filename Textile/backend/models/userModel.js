const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter name']
    },
    email: {
        type: String,
        required: [true, 'please enter mail address'],
        unique: true,
        validate: [validator.isEmail, 'please enter valid Email or password']
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        maxlength: [6, 'password cannot exceed 6 characters'],
        select: false
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },

    resetPasswordToken: String,

    resetPasswordTokenExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function (next) {
    return jwtToken.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRE
    })
}
userSchema.methods.isValidPassword = async function (userpassword) {
    return  bcrypt.compare(userpassword, this.password)
}

userSchema.methods.getresetToken = function () {
    //generate token
    const token = crypto.randomBytes(20).toString('hex')

    //generate hash and set setpassword token
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //generate token expires
    this.resetPasswordTokenExpire=Date.now() + 2 * 60 * 1000;
    return token;
}

let userModel = mongoose.model('users', userSchema)
module.exports = userModel