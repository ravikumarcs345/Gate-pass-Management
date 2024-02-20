const app = require('./app')

const dbConnection = require("./config/database")

dbConnection()

const server = app.listen(process.env.PORT, () => {
    console.log(`server is started:${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    console.log("shutting down dude to unHandledRejection")
    server.close(() => {
        process.exit(1)
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`)
    console.log("server shuttiing down dude to unCaughtException")
    server.close(() => {
        process.exit(1)
    })
})
