const socketio = require("./socket.js")
const schemas = require("./schemas.js")
const express = require('express')
const session = require('express-session')
const http = require('http')
const cors = require('cors')
const mongoose = require("mongoose")
require('dotenv').config()

const PORT = process.env.PORT || 5000
const User = schemas.Users
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@custom-chess.s847jfs.mongodb.net/custom-chess-users?retryWrites=true&w=majority`

mongoose.connect(dbUri)

const app = express()

// Note: To scale, could use redis
app.use(
    session({
        secret: "my_session_secret", 
        resave: true, 
        saveUninitialized: false
    })
)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}), express.json())

const server = http.createServer(app)

const io = socketio.getIo(server)

app.post("/api/signup", async (req, res) => {
    const {username, password} = req.body
    let isValid = false
    let errMessage = ""
    // Check if username is already in database
    const existUsername = await User.findOne({ username: username})
    if (existUsername) {
        errMessage = "Username unavailable"
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
            req.session.user = username
            req.session.save()
        }
    }
    res.status(200).json({isValid: isValid, errMessage: errMessage})
})

app.post("/api/login", async (req, res) => {
    const {username, password} = req.body
    let isValid = false
    let errMessage = ""

    const loginUser = await User.findOne({ username: username })
    if (loginUser) {
        loginUser.comparePassword(password, (match) => {
            if (match) {
                isValid = true
                req.session.user = username
                req.session.save()
            } else {
                errMessage = "Invalid password"
            }
        })
    } else {
        errMessage = "Invalid username"
    }

    res.status(200).json({isValid: isValid, errMessage: errMessage})
})

app.get("/api/loggedin", (req, res) => {
    res.status(200).json({loggedIn: Boolean(req.session.user)})
})

app.get("/api/userstats", async (req, res) => {
    const username = req.session.user
    const loggedIn = Boolean(username)
    let wins = 0, losses = 0, draws = 0

    if (loggedIn) {
        // Get user's stats from database
        const userstats = await User.findOne({ username: username })
        wins = userstats.wins
        losses = userstats.losses
        draws = userstats.draws
    }

    res.status(200).json({
        loggedIn: loggedIn,
        username: username,
        wins: wins,
        losses: losses,
        draws: draws
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
