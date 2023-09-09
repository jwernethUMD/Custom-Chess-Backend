const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema
const saltRounds = 10

const userSchema = new Schema({
    username: String,
    password: String,
    wins: Number,
    losses: Number,
    draws: Number
})

userSchema.pre("save", function (next) { // Not arrow function because need "this" value
    bcrypt.genSalt(saltRounds)
    .then((salt) => {
        return bcrypt.hash(this.password, salt)
    })
    .then((hash) => {
        this.password = hash
        next()
    })
    .catch((error) => {
        return next(error)
    })
})

const Users = mongoose.model("User", userSchema)
module.exports = {
    "Users": Users
}