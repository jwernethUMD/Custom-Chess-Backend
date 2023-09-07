// import { Server } from "socket.io"
const socketIo = require("socket.io")

let activeGames = new Map()

function getMultiplayerId(length) {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let cLength = chars.length
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * cLength)]
    }

    if (activeGames.has(result)) {
        result = getMultiplayerId(length)
    }

    return result
}

function getIo(server) {
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    })

    io.on("connection", (socket) => {
        socket.on("multiplayer-started", (rules, sendCode) => {
            let roomId = getMultiplayerId(6)
            activeGames.set(roomId, rules)
            socket.join(roomId)
            sendCode(roomId)
        })
    
        socket.on("check-multiplayer", (gameCode, validateGame) => {
            const connectedSockets = io.sockets.adapter.rooms.get(gameCode)
            const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id)
    
            if (!connectedSockets) {
                validateGame(false, "No game found")
            } else if (socketRooms.length > 0 || connectedSockets.size >= 2) {
                validateGame(false, "Game full")
            } else {
                validateGame(true, "")
            }
        })
    
        socket.on("join-multiplayer", (gameCode, sendGameInfo) => {
            socket.join(gameCode)
            // Decide which one is white/black
            let gameCreatorIsWhite = Math.random() > 0.5
            let gameCreatorColor = gameCreatorIsWhite ? "white" : "black"
            let gameJoinerColor = gameCreatorIsWhite ? "black" : "white"
            socket.to(gameCode).emit("opponent-joined", gameCreatorColor)
            sendGameInfo(activeGames.get(gameCode), gameJoinerColor)
        })
    
        socket.on("player-moved", (gameCode, piece, x, y) => {
            socket.to(gameCode).emit("opponent-moved", piece, x, y)
            socket.to(gameCode).emit("test")
        })
    
        socket.on("player-captured", (gameCode, piece, x, y, capturedPieceId, capturedPieceType, capturedPieceColor) => {
            socket.to(gameCode).emit("opponent-captured", piece, x, y, capturedPieceId, capturedPieceType, capturedPieceColor)
        })
    
        socket.on("player-king-moved", (gameCode, piece, x, y) => {
            socket.to(gameCode).emit("opponent-king-moved", piece, x, y)
        })
    
        socket.on("player-draw-offer", (gameCode) => {
            socket.to(gameCode).emit("opponent-draw-offer")
        })
    
        socket.on("draw-game", (gameCode) => {
            socket.to(gameCode).emit("draw-game")
        })
    
        socket.on("multiplayer-left", () => {
            console.log("Player left")
            // Remove player from room, remove game from activeGames
        })
    })

    return io
}

module.exports = {
    getIo: getIo
}