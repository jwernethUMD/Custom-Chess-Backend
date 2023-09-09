const socketio = require("./socket.js")
const schemas = require("./schemas.js")
const express = require('express')
const http = require('http')
const cors = require('cors')
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
require('dotenv').config()

const User = schemas.Users
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@custom-chess.s847jfs.mongodb.net/custom-chess-users?retryWrites=true&w=majority`

const saltRounds = 10

mongoose.connect(dbUri)

const app = express()
app.use(cors({
    origin: "http://localhost:3000"
}), express.json())

const server = http.createServer(app)

const io = socketio.getIo(server)

app.post("/api/signup", async (req, res) => {
    const {username, password} = req.body
    let isValid = false
    // Check if username is already in database
    const existUsername = await User.findOne({ username: username})
    if (existUsername) {
        console.log('username taken')
    } else {
        // Create new account with username/password combo
        const newUser = new User({
            username: username,
            password: password, // NEED TO HASH PASSWORD
            wins: 2,
            losses: 3,
            draws: 5
        })

        const userSaved = await newUser.save()
        
        if (userSaved) {
            isValid = true
        }
    }

    res.status(200).json({isValid: isValid})
})

app.post("/api/login", async (req, res) => {
    const {username, password} = req.body
    let isValid = false
    let errMessage = ""

    const loginUser = await User.findOne({ username: username })
    if (loginUser) {
        console.log(loginUser)
    } else {
        errMessage = "User doesn't exist"
    }

    res.status(200).json({isValid: isValid, errMessage: errMessage})
})

server.listen(5000, () => {
    console.log('Server is running on port 5000')
})
