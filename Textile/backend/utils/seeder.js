const products=require('../products/products.json')
const schema=require('../models/models')
const dotenv=require('dotenv')
const dbConnection=require('../config/database')
dotenv.config({path:'backend/config/config.env'})
dbConnection()
const seederdata=async()=>{
    try{
        await schema.deleteMany()
            console.log("previous data deleted")
        await schema.insertMany(products)
            console.log("All data inserted")
       }
   catch(e){
        console.log("data not added",e)
          }
          process.exit()
}
seederdata();