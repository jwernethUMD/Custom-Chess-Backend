const socketio = require("./socket.js")
const express = require('express')
const http = require('http')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: "http://localhost:3000"
}), express.json())

const server = http.createServer(app)

const io = socketio.getIo(server)

app.post("/api/signup", (req, res) => {
    const {username, password} = req.body
    console.log(username, password)
    res.status(200).json({isValid: true})
})

server.listen(5000, () => {
    console.log('Server is running on port 5000')
})