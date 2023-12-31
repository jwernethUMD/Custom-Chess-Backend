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
    if (!this.isModified("password")) {
        next() // Don't re-encrypt password if it hasn't changed
    }

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

userSchema.methods.comparePassword = async function(password, callback) {
    await bcrypt.compare(password, this.password)
    .then((match) => {
        return callback(match)
    })
    .catch((error) => {
        console.error(error)
    })
}

const Users = mongoose.model("User", userSchema)
module.exports = {
    "Users": Users
}