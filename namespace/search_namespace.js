const mongoose = require('mongoose');

const search_namespace = mongoose.Schema({
    title: {
        type: String,
    },
    context: {
        type: String,
        index: true
    },
    page: {
        type: Number
    }
}, {
    timestamps: true,
})


module.exports = mongoose.model("Search", search_namespace);