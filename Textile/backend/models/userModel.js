const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')
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
        select:false
    },
    avatar: {
        type: String,
        required: true
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

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwtToken.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRE
    })
}
userSchema.methods.isValidPassword=async function(userpassword){
      return await bcrypt.compare(userpassword,this.password)
}

let userModel = mongoose.model('users', userSchema)
module.exports = userModel