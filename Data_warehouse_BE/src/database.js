const { DATABASE, HOST } = require('./config');
const mongoose = require('mongoose');

function initDatabase() {

    mongoose.connect(`mongodb://${HOST}/${DATABASE}`, { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('we are connected!')
    });
}

module.exports = {
    initDatabase
}