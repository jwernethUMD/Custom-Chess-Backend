const socketio = require("./socket.js")
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

const io = socketio.getIo(server)

// Express routes go here

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});