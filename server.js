//
// server.js
//
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var logger = require('morgan');
var mongodb = require('./config/mongo.db');
var userroutes_v1 = require('./api/user.routes.v1');
// var auth_routes_v1 = require('./api/authentication.routes.v1');
var config = require('./config/config');
// var expressJWT = require('express-jwt');

var app = express();

// Met module.exports kunnen we variabelen beschikbaar maken voor andere bestanden.
// Je zou dit kunnen vergelijken met het 'public' maken van attributen in Java.
// Javascript neemt impliciet aan dat bovenaan ieder bestand de volgende regel staat.
// Deze kun je dus weglaten!
// Zie eventueel ook: https://www.sitepoint.com/understanding-module-exports-exports-node-js/  
module.exports = {};

// bodyParser zorgt dat we de body uit een request kunnen gebruiken,
// hierin zit de inhoud van een POST request.
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// Beveilig alle URL routes, tenzij het om /login of /register gaat.
// app.use(expressJWT({
//     secret: config.secretkey
// }).unless({
//     path: [
//         { url: '/api/v1/login', methods: ['POST'] },
//         { url: '/api/v1/register', methods: ['POST'] }
//     ]
// }));

// configureer de app
app.set('port', (process.env.PORT | config.webPort));
app.set('env', (process.env.ENV | 'development'))

// Installeer Morgan als logger
app.use(logger('dev'));

// Installeer de routers
// app.use('/api/v1', auth_routes_v1);
app.use('/api/v1', userroutes_v1);

// Errorhandler voor express-jwt errors
// Wordt uitgevoerd wanneer err != null; anders door naar next().
app.use(function(err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

// Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd. 
app.use('*', function(req, res) {
    res.status(400);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

// Installatie klaar; start de server.
app.listen(process.env.PORT || 3000, function() {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/users');
});

// Voor testen met mocha/chai moeten we de app exporteren.
module.exports = app;