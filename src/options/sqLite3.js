const knexSqLite3 = require('knex')({
    client:'sqlite3',
    connection: {filename: './db/mysql.sqlite'},
    useNullAsDefault: true,
})

module.exports={knexSqLite3};