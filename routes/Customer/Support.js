const express = require('express');
const router = express.Router();
const db = require('../db');

const PostSupport = (req,res)=>{
    console.log(req.body);
    const {name,city,newspaper,issue} = req.body;
    const id = req.params.id
   
    const sql = `INSERT INTO issue (name,city,newspaper,suggestion,c_id) VALUE ('${name}','${city}','${newspaper}','${issue}',${id})`
    const query = db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            res.send("err");
            return;
        }
        console.log(result);
        res.send("yes")
    })
}


router.route('/:id')
.post(PostSupport)

module.exports = router;