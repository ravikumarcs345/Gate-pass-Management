const express=require('express')
const app=express()
const Error=require('./middleware/error')
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser)
const router=require('./routes/productsRouter')
const authRouter=require('./routes/authRouter')

app.use('/api/v1',router)
app.use('/api/v1',authRouter)
app.use(Error)
module.exports=app
