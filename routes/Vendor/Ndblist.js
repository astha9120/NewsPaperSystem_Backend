const express = require('express');
const router = express.Router();
const db = require('../db');


const GetNdb = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT name,address,area,city,state FROM ndb WHERE v_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
            console.log(result);
            res.send(result)
        
    })

}


// router.route('/:id')
// .get(Vendors)

router.route('/:id')
.get(GetNdb)
module.exports = router;