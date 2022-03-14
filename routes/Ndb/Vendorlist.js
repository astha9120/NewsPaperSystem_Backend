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

const GetVendor = (req,res)=>{
    const id = req.params.id;
    //console.log("id "+id)
    const sql = `SELECT v_id FROM ndb WHERE ndb_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
        //console.log(result[0].v_id);
        const sql =  `SELECT name,phoneno,address,area FROM vendor WHERE v_id=${result[0].v_id}`
        const query = db.query(sql,(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.send(result)
        })
    })

}


router.route('')
.get(Vendors)

router.route('/:id')
.get(GetVendor)
module.exports = router;