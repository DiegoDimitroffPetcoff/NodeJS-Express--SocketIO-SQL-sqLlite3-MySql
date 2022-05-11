const knex = require('knex')({
    client:'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'desafio16',
    },
    pool: {min:0, max: 7}
})

module.exports={knex};