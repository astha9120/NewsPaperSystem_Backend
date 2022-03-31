const express = require('express');
const router = express.Router();
const db = require('../db');

const Vendorlist = (req,res)=>{
    const sql = `SELECT name,v_id,address,area,city,state,phoneno,charge,accept from vendor`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
      
            res.send(result)
        
    })
}

const changeStatus = (req,res)=>{
    const id = parseInt(req.params.id);
    const sql = `UPDATE vendor SET accept = 1 WHERE v_id=${id}`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.send("yess")
        
    })
}




router.route('/').get(Vendorlist)
router.route('/:id').put(changeStatus)


module.exports = router;