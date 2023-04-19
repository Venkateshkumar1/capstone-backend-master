const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }
}, {timestamp: true});

const User = mongoose.model('User', Schema); // User

module.exports = User; 