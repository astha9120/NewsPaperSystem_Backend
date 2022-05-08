const express = require('express');
const router = express.Router();
const db = require('../db');


const Bill = (req,res)=>{
    const sql = `select customer.name,customer.address,customer.area,orders.bill,orders.bill_status,orders.o_id,orders.date from customer 
                inner join orders using(c_id) 
                where orders.bill_status=0 and customer.ndb_id=${req.params.id}
                order by latitude,longitude`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err
        res.send(result)
    })
}

const updateStat = (req,res)=>{
    const date = new Date().toJSON().slice(0,10).replace(/-/g,'-')
    console.log(date)
    const sql = `update orders set bill_status = 1 , collection_date = '${date}' where o_id=${req.params.id};`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("update")
        console.log(result);
        res.send("yes")
    })
}

const BillCollected = (req,res)=>{

    const id = req.params.id
    const date = req.params.date;
    console.log(date)

    const sql = `select customer.name,customer.address,customer.area,orders.bill,orders.collection_date,orders.o_id from customer 
                 inner join orders using(c_id)  where customer.ndb_id=${id} 
                 and collection_date is not null
                 and bill_status = true
                 and collection_date >= '${date}' `
    const q = db.query(sql,(err,result)=>{
        console.log(result)
        res.send(result)
    })    
}

router.route('/:id')
.get(Bill)
.put(updateStat)

router.route('/:id/:date')
.get(BillCollected)

module.exports = router;