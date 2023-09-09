const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    wins: Number,
    losses: Number,
    draws: Number
})

const Users = mongoose.model("User", userSchema)
module.exports = {
    "Users": Users
}