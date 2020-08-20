const { Pool } = require('pg')

module.exports = new Pool({
    user: "postgres",
    password: "rdtc04042001",
    host: "localhost",
    port: 5432,
    database: "launchstoredb"
})