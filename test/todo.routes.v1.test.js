//
// Tests voor ToDo routes van de API.
//
process.env.NODE_ENV = 'test';
process.env.APP_USERNAME = 'username';
process.env.APP_PASSWORD = 'password';

var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var server = require('../server');
var chould = chai.should();

var token;
var todoID;

chai.use(chaiHttp);

//
// Helperfunctie om een geldig token op te halen.
// Alle testcases maken hier gebruik van.
//
var getToken = function() {
    var user = {
        username: "username",
        password: "password"
    }
    chai.request(server)
        .post('/api/v1/login')
        .send(user)
        .end(function(err, res) {
            res.body.should.be.an('object');
            res.body.should.have.property('token');
            // Bewaar het token in de globale variabele, zodat de tests het token kunnen gebruiken.
            token = res.body.token;
        });
}

// Voordat de testcases uitgevoerd kunnen moeten we een token ophalen.
// Dat doen we in deze 'dummy' testcase. Dit is niet helemaal netjes,
// maar we moeten een test uitvoeren om een geldig token te hebben ... 
describe('Get a valid token', function() {

    // Zorg dat we een token hebben zodat we de tests kunnen uitvoeren.
    before(function() {
        getToken();
    });

    // Hier start een testcase
    it('should return a valid token', function(done) {
        chai.request(server)
            .get('/api/v1/todos')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                // we doen hier niets - we willen alleen het token dat opgehaald is.
                done();
            });
    });
});

// Hier start een testcase.
describe('GET /api/v1/todos', function() {

    // Zorg dat we een token hebben zodat we de tests kunnen uitvoeren.
    before(function() {
        if (!this.token) {
            getToken();
        }
    });

    // zet waarden die we nodig hebben om te testen - is nog niet nodig.
    beforeEach(function() {});

    // reset waarden die voor een test zijn ingesteld - is nog niet nodig.
    afterEach(function() {});

    // Hier start een testcase
    it('should return all ToDos when logged in', function(done) {
        chai.request(server)
            .get('/api/v1/todos')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result').that.is.an('array');
                res.body.result.should.have.lengthOf(4);
                done();
            });
    });

    // 
    // Hier kunnen eventueel meer tests komen voor dezelfde testcase.
    // 
});

describe('GET /api/v1/todo/:id', function() {

    // Zorg dat we een token hebben zodat we de tests kunnen uitvoeren.
    before(function() {
        if (!this.token) {
            getToken();
        }
    });

    // Hier start een testcase.
    it('should return a single ToDo on a valid ID', function(done) {
        var todoID = 1;
        chai.request(server)
            .get('/api/v1/todos/' + todoID)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result').that.is.an('array');
                res.body.result.should.have.lengthOf(1);
                res.body.result[0].should.include({ ID: todoID });
                res.body.result[0].should.have.property('ID').equal(todoID);
                res.body.result[0].should.have.property('Titel').that.is.a('string');
                res.body.result[0].should.have.property('Beschrijving').that.is.a('string');
                res.body.result[0].should.have.property('Status').that.is.a('string').equal('OPEN');
                // Om te testen of de datum correct is hebben we een extra library nodig.
                // Is nu niet uitgewerkt, maar zie evt. http://chaijs.com/plugins/chai-datetime/
                // res.body.result[0].should.have.property('LaatstGewijzigdOp').that.is.a('date');

                done();
            });
    });

    // Hier start een testcase.
    // Wanneer je een ongeldige ID vraagt, krijg je een leeg array.
    // Een foutmeling zou misschien mooier zijn...
    it('should return empty array on invalid ID', function(done) {
        var todoID = 9999;
        chai.request(server)
            .get('/api/v1/todos/' + todoID)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result').that.is.an('array');
                res.body.result.should.have.lengthOf(0);

                done();
            });
    });
});

describe('POST /api/v1/todos', function() {

    // Zorg dat we een token hebben zodat we de tests kunnen uitvoeren.
    before(function() {
        if (!this.token) {
            getToken();
        }
    });

    // We voegen in deze test een ToDo toe.
    // Voor de goede orde moeten we die verwijderen,
    // zodat volgende tests met een schone lei verder kunnen.
    afterEach(function() {
        var db = require('../config/db');
        var query = 'DELETE from todos WHERE ID=' + todoID;
        db.query(query, function(error, rows, fields) {
            if (error) {
                console.error('Niet gelukt om item te verwijderen!');
            };
        });
    });

    // Hier start een testcase.
    it('should save a new ToDo when using valid ToDo data', function(done) {
        var todo = {
            Titel: "Nieuwe ToDo",
            Beschrijving: "Hier staat tekst"
        }
        chai.request(server)
            .post('/api/v1/todos')
            .send(todo)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('result').that.is.an('object');
                res.body.result.should.have.property('affectedRows').equal(1);
                res.body.result.should.have.property('changedRows').equal(0);
                res.body.result.should.have.property('warningCount').equal(0);
                res.body.result.should.have.property('message').equal('');

                // Bewaar de ID van de zojuist toegevoegde ToDo.
                // Die moeten we na deze test weer verwijderen.
                todoID = res.body.result.insertId;

                done();
            });
    });

    // 
    // Hier kunnen eventueel meer tests komen voor dezelfde testcase.
    // Mogelijke test: mogen we een ToDo opslaan zonder titel of beschrijving?
    //
});