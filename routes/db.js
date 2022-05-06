// const mysql = require("mysql2")


// // Database connection 

// const db = mysql.createConnection({
//     host:'localhost',
//     user:process.env.db_user,
//     password:process.env.db_password,
//     database:'newspapersystem'
// })

// db.connect((err)=>{
//     if(err){
//         throw err;
//     }
//     console.log("mysql connected")
// })

// module.exports = db

const Pool = require("pg").Pool;

const pool  = new Pool({
    user : "postgres",
    password:"maulina",
    host:"localhost",
    port:5432,
    database:"newsdaily" 
});

module.exports = pool;
 





