const mysql = require("mysql2")


// Database connection 

const db = mysql.createConnection({
    host:'localhost',
    user:process.env.db_user,
    password:process.env.db_password,
    database:'newspapersystem'
})

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("mysql connected")
})

module.exports = db



