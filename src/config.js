const { config } = require('dotenv')
config()


const PORT = process.env.PORT 

const DB_HOST = process.env.DB_HOST ;
const DB_USER = process.env.DB_USER ;
const DB_PASSWORD = process.env.DB_PASSWORD ;
const DB_DATABASE = process.env.DB_DATABASE ;
const DB_PORT = process.env.DB_PORT;
const KEY = process.env.KEY 
const KEY_PUBLIC = process.env.KEY 
const CLAVEGMAIL = process.env.CLAVEGMAIL

// const PORT = process.env.PORT || 3005

// const DB_HOST = process.env.DB_HOST || 'mysql-chagas.alwaysdata.net';
// const DB_USER = process.env.DB_USER || 'chagas';
// const DB_PASSWORD = process.env.DB_PASSWORD || 'Ag//5556//';
// const DB_DATABASE = process.env.DB_DATABASE || 'chagas_chagas';
// const DB_PORT = process.env.DB_PORT || 3306;
// const KEY = process.env.KEY || 'KEY2024saxasxasxnhmnbfger63'
// const KEY_PUBLIC = process.env.KEY || 'SAHKHFQ{+Ñ56576FVCDHVSJHVvjhhjh677HBHBJ6r7ftg132*$%#"#$%&/(9FBBKWEJNFKJBEKJ'
// const CLAVEGMAIL = process.env.CLAVEGMAIL || 'frqhuvfcwdccomfh'

// const DB_HOST = process.env.DB_HOST || 'localhost';
// const DB_USER = process.env.DB_USER || 'root';
// const DB_PASSWORD = process.env.DB_PASSWORD || '';
// const DB_DATABASE = process.env.DB_DATABASE || 'chagas';
// const DB_PORT = process.env.DB_PORT || 3306;
// const KEY = process.env.KEY || 'KEY2023'
// const KEY_PUBLIC = process.env.KEY || 'SAHKHFQ{+Ñ56576FVCDHVSJHVvjhhjh677HBHBJ6r7ftg132*$%#"#$%&/(9FBBKWEJNFKJBEKJ'
// const CLAVEGMAIL = process.env.CLAVEGMAIL || 'frqhuvfcwdccomfh'


// const DB_HOST = process.env.DB_HOST || 'elduendesucre.com';

// const DB_USER = process.env.DB_USER || 'elduende_sistemas';

// const DB_PASSWORD = process.env.DB_PASSWORD || 'Ag//5556//zxzx';//git init

// const DB_DATABASE = process.env.DB_DATABASE || 'elduende_chagas';

// const DB_PORT = process.env.DB_PORT || 3306;

// const KEY = process.env.KEY || 'KEY2024ABCQIGtRs[]00-'

// const CLAVEGMAIL = process.env.CLAVEGMAIL || 'frqhuvfcwdccomfh'



module.exports = {
    PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, KEY, CLAVEGMAIL
}


