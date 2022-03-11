const express = require('express');
const router = express.Router();
const db = require('../db');

const Vendors = (req,res)=>{
    const sql = `SELECT name,phoneno,address,area FROM vendor`
    const query = db.query(sql,(err,result)=>{
        console.log(result);
        res.send(result)
    })
}


router.route('')
.get(Vendors)

module.exports = router;