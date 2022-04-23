const express = require('express');
const router = express.Router();
const db = require('../db');

const Support = (req,res)=>{
    const sql = `SELECT issue_id,suggestion,name,email from issue`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
      
            res.send(result)
        
    })
}


router.route('/').get(Support)

module.exports = router;