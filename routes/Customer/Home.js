const express = require('express');
const router = express.Router();
const db = require('../db');

const NewsPaper = (req,res)=>{
    const sql = `SELECT * from newspaper`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
}


router.route('')
.get(NewsPaper)

module.exports = router;