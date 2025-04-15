const { createPool } =require("mysql2/promise")

const pool1 = createPool({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'sispap'
})





module.exports = pool1
