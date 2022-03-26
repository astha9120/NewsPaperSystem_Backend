const express = require('express');
const router = express.Router();
const db = require('../db');

const Vendors = (req,res)=>{
    const sql = `SELECT state,city FROM ndb WHERE ndb_id=${req.params.id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result)
        const sql = `SELECT name,phoneno,address,area FROM vendor WHERE state='${result[0].state}' and city='${result[0].city}'`
        const query = db.query(sql,(err,result)=>{
            console.log(result);
            res.send(result)
        })
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


const GetQuantity = (req,res)=>{
    const id = req.params.id
    let charge=0;
    const sql = `SELECT v_id FROM ndb WHERE ndb_id=${id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result)

        const sql2 = `SELECT charge FROM vendor WHERE v_id=${result[0].v_id}`
        const q2 = db.query(sql2,(err,result2)=>{
            charge = result2[0].charge;
            console.log(charge)

            const sql3 = `SELECT newspaper.name , ndb_list.count , newspaper.price FROM ndb_list
            INNER JOIN newspaper USING (n_id)
            WHERE ndb_id=${id}`

            const q3 = db.query(sql3,(err,result3)=>{
                console.log(result3)
                result3.map(e=>{
                    e.price = (e.price+charge) * e.count
                })
                res.send(result3)
            })
        })
    })

}

router.route('/:id')
.get(Vendors)

router.route('/allocate/:id')
.get(GetVendor)

router.route('/quantity/:id')
.get(GetQuantity)

module.exports = router;