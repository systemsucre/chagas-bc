const { createPool } =require("mysql2/promise")
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER,  DB_DATABASE1, DB_HOST1, DB_PASSWORD1, DB_PORT1, DB_USER1 } =require('../config.js')

// const pool = createPool({
//     user: 'root',
//     password: 'ZHFSW66d5vLgbSo69iFg',
//     host: 'containers-us-west-110.railway.app',
//     port: 6753,
//     database: 'railway'
// })

const pool = createPool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE
})



module.exports = pool
