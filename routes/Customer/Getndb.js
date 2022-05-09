const express = require('express');
const router = express.Router();
const db = require('../db');

const Getndb = (req,res)=>{
    const id = req.params.id;
    //console.log("id "+id)
    const sql = `SELECT ndb_id FROM customer WHERE c_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) 
            res.status(400).send("error")
        //console.log(result[0].v_id);
        const sql =  `SELECT name,phoneno FROM ndb WHERE ndb_id=${result[0].ndb_id}`
        const query = db.query(sql,(err,result)=>{
            if(err)
                res.status(400).send("error")
            console.log(result);
            res.send(result)
        })
    })

}

router.route('/:id')
.get(Getndb)

module.exports = router;