const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: String,
        required: true
    },
    region: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    interest: {
        type: Number
    },
    contactChannel: [{ type: Schema.Types.ObjectId, ref: 'ContactChannel' }]
}, { versionKey: false })

const ContactChannelSchema = new Schema({
    contactChannel: {
        type: String,
        required: true
    },
    userAcount: {
        type: String,
        required: true
    },
    preferences: {
        type: String,
        required: true
    }
}, { versionKey: false });

const Contact = mongoose.model('contacts', ContactSchema);
const ContactChannel = mongoose.model('contactChannels', ContactChannelSchema)

module.exports = {
    Contact,
    ContactChannel
}