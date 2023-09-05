// Make this a map
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

const io = require("socket.io")(5000, {
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
        console.log("player moved", gameCode, socket.id)
        const connectedSockets = io.sockets.adapter.rooms.get(gameCode)
        console.log(connectedSockets)
        socket.to(gameCode).emit("opponent-moved", piece, x, y)
    })

    socket.on("multiplayer-left", () => {
        console.log("HEY HEY!")
    })
})