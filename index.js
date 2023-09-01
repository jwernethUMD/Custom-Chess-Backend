const express = require("express")
const app = express()

app.get("/api", (req, res) => {
    res.json({"test": [1, 2, 3]})
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})