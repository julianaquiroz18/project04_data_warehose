const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { City } = require('../models/cities');

const Company = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    }
}, { versionKey: false })

module.exports = mongoose.model('companies', Company)