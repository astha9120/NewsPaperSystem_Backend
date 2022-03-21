const express = require('express');
const router = express.Router();
const db = require('../db');


const Bill = (req,res)=>{
    const sql = `select customer.name,customer.address,customer.area,orders.bill,orders.bill_status,orders.o_id from customer 
                inner join orders using(c_id) 
                where orders.bill_status=0 and customer.ndb_id=${req.params.id}
                order by latitude,longitude`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.send(result)
    })
}

const updateStat = (req,res)=>{
    const sql = `update orders set bill_status = 1 where o_id=${req.params.id};`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send("yes")
    })
}


router.route('/:id')
.get(Bill)
.put(updateStat)

module.exports = router;