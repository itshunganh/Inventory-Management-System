const mysql = require('mysql');


const pool  = mysql.createPool({
    connectionLimit : 10,
    host: "us-cdbr-east-03.cleardb.com",
    user: "b51c1693f11116",
    password: "edb34238",
    database: "heroku_f0d1bfb747fe8bb"
});
 


module.exports = pool;