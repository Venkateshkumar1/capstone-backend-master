const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: false
    },
    resolverId: {
        type: String,
        required: false
    },
    resolverName: {
        type: String,
        required: false
    }
}, {timestamp: true});

const Query = mongoose.model('Query', Schema); // User

module.exports = Query;