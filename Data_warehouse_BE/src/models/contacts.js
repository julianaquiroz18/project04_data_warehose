const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Region, Country, City } = require('../models/cities');
const Company = require('../models/companies');

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City'
    },
    address: {
        type: String
    },
    interest: {
        type: Number
    },
    contactChannel: {
        type: Array
    }
}, { versionKey: false })

const Contact = mongoose.model('contacts', ContactSchema);

module.exports = {
    Contact
}