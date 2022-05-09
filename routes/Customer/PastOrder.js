const express = require('express');
const router = express.Router();
const db = require('../db');

const Orders = async(req,res)=>{
    const sql = `SELECT orders.o_id , orders.date , orders.bill , orders.bill_status 
                FROM orders WHERE c_id=${req.params.id} `
    const query = db.query(sql,(err,result)=>{
        if(err){
            res.status(400).send("error");
             throw err};
        res.send(result)        
    })
}

router.route('/:id')
      .get(Orders)

module.exports = router;