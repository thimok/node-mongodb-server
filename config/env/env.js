var env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'users'
}

var dburl = process.env.ENV === 'production' ?
    'mongodb://' + env.DB_USER + ':' + env.DB_PASSWORD + '@' + env.DB_HOST + ':15166/' + env.DB_DATABASE :
    'mongodb://localhost/' + env.dbDatabase

module.exports = {
    env: env,
    dburl: dburl
};