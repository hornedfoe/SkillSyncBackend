const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    username: { type: String, unique: true },
    role : { type: String },
    specialization: { type: Array },
    pastexperiences: { type: Array },
});

module.exports = model("User", userSchema);