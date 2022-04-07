const express = require('express');
const router = express.Router();
const db = require('../db');

const NewsPaper = (req,res)=>{
    const sql = `SELECT state,city from customer where c_id=${req.params.id}`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
        let city = result[0].city
        let state = result[0].state
        const sql = `select distinct(newspaper.name) , newspaper.description,newspaper.n_id,newspaper.price,newspaper.scrap_price from newspaper
        inner join service using (n_id) inner join vendor using (v_id) where vendor.state="${state}" and vendor.city="${city}"`
        const query =  db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send(result)
        })
    })
}

const GetNoti = ()=>{
    const id = req.params.id;
    const sql = `SELECT log FROM customer WHERE c_id=${id}`
    let notifications = []
    const q = db.query(sql,(err,result)=>{
        if(result[0].log==1)
            notifications.push("Newspaper has been delivered")
    })
}

router.route('/:id')
.get(NewsPaper)

router.route('/daily/:id')
.get(GetNoti)

module.exports = router;