const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    avatar: { type: String },
    googleId: { type: String }

})

module.exports = mongoose.model('ACCOUNTS', userSchema)