const { Schema, model } = require('mongoose')

const otpSchema = new Schema({
    email: { type: String, unique: true },
    otp:{type: Number},
    expiration: { type: Date, default: Date.now, expires: 60 }
});

module.exports = model("Otp", otpSchema);