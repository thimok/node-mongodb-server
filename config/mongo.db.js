const mongoose = require('mongoose');
const config = require('../config/config.json');

// Gebruik es6 promises ipv mongoose mpromise
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://' + config.dbHost + '/' + config.dbDatabase);
var connection = mongoose.connection
    .once('open', () => console.log('Verbonden met mongo db \'' + config.dbDatabase + '\''))
    .on('error', (error) => {
        console.warn('Warning', error.toString());
    });

module.exports = connection;