const express = require('express');
const router = express.Router();
const db = require('../db');

const PostSupport = (req,res)=>{
    //console.log(req.body);
    const {name,email,issue} = req.body;
   
    const sql = `INSERT INTO issue (name,email,suggestion) VALUE ('${name}','${email}','${issue}')`
    const query = db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            res.status(400).send("error")
            return;
        }
        console.log(result);
        res.send("yes")
    })
}


router.route('')
.post(PostSupport)

module.exports = router;