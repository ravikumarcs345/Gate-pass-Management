const mongoose = require('mongoose')
const dbConnection = () => {
    mongoose.connect(process.env.DB_LOCAL_URL, {

        useNewUrlParser: true,
        useUnifiedTopology: true
    })

        .then((con) => {
            console.log(`Database is connected: ${con.connection.host}`)
        })

        

}
module.exports = dbConnection