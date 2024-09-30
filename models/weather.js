// models/weather.js
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Weather', weatherSchema);
