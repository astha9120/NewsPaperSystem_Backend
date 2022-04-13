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

const GetNoti = (req,res)=>{
    const id = req.params.id;
    const sql = `SELECT log FROM customer WHERE c_id=${id}`
    let Nowdate =  new Date()
    // console.log(Nowdate)

    let notifications = []
    const q = db.query(sql,(err,result)=>{
        console.log(result)
        if(result[0].log==1)
            notifications.push("Newspaper has been delivered")
        
        const sql2 = `SELECT date FROM orders WHERE subscribe = 1 and c_id=${id}`
        const q2 = db.query(sql2,(err,result2)=>{
            console.log(result2)
            let fi = result2.map(e=>{
                //console.log(e.date)
                let d = new Date(e.date)
                console.log(d)
                let diff = Math.abs(Nowdate-d)
                diff= Math.floor(diff/(1000 * 3600 * 24))
                console.log(diff)
                if(diff>=27 && diff<=30)
                    return e;
            })
            if(fi.length>=1)
                notifications.push("Your Subscription will be expired in few days")
            res.send(notifications)
        })

        
    })
}

const MarkRead = (req,res)=>{
    const id = req.params.id;
    const sql = `UPDATE customer SET log = 0 WHERE c_id=${id}`
    const q = db.query(sql,(err,result)=>{
        console.log(result)
        res.send("Done")
    })
}

router.route('/:id')
.get(NewsPaper)

router.route('/daily/:id')
.get(GetNoti)
.post(MarkRead)

module.exports = router;