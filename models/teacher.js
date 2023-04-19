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

const Teacher = mongoose.model('Teacher', Schema); // User

module.exports = Teacher;