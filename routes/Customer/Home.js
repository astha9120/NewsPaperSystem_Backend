const express = require('express');
const router = express.Router();
const db = require('../db');

const NewsPaper = (req,res)=>{
    const sql = `SELECT state,city from customer where c_id=${req.params.id}`
    const query= db.query(sql,(err,result)=>{
        if(err) 
        {
            res.status(400).send("error");
            throw err
        };
        console.log(result)
        let city = result[0].city
        let state = result[0].state
        const sql = `select distinct(newspaper.name) , newspaper.description,newspaper.n_id,newspaper.price,newspaper.scrap_price from newspaper
        inner join service using (n_id) inner join vendor using (v_id) where vendor.state="${state}" and vendor.city="${city}"`
        const query =  db.query(sql,(err,result)=>{
            if(err){
                res.status(400).send("error")
            }
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
        if(err) throw err
        console.log(result)
        if(result[0].log==1)
            notifications.push("Newspaper has been delivered")
        
        let flag_expired =0 ,flag_bill=0; 
        const sql2 = `SELECT date,bill_status FROM orders WHERE subscribe = 1 and c_id=${id} and log=1`
        const q2 = db.query(sql2,(err,result2)=>
            {
            console.log(result2)
            result2.map(e=>{
                //console.log(e.date)
                let d = new Date(e.date)
                console.log(d)
                let diff = Math.abs(Nowdate-d)
                diff= Math.floor(diff/(1000 * 3600 * 24))
                console.log(diff)
                if(diff>=27 && diff<=30)
                    flag_expired=1;
                if(diff>30 && e.bill_status==0 && diff<=35)
                    flag_bill=1;
            })

            if(flag_expired==1)
                notifications.push("Your Subscription will be expired in few days")
            if(flag_bill==1){
                notifications.push("Your subscription is expired , renew it now if you haven't done it")
                notifications.push("Please pay the bill to your delivery boy")

            }
            res.send(notifications)
        })

        
    })
}

const MarkRead = (req,res)=>{
    const id = req.params.id;
    const sql = `UPDATE customer SET log = 0 WHERE c_id=${id}`
    const q = db.query(sql,(err,result)=>{
        console.log(result)

        const sql2 = `UPDATE orders SET log = 0 WHERE c_id = ${id}`
        const q2 = db.query(sql2,(err,result2)=>{
            console.log(result2)
            res.send("done")
        })
        
    })
}

router.route('/:id')
.get(NewsPaper)

router.route('/daily/:id')
.get(GetNoti)
.post(MarkRead)

module.exports = router;