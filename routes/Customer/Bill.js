const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../db');

const GetCustomer = (req,res)=>{
    const sql = `SELECT customer.name,customer.address,customer.area,orders.date,orders.scrap_service,orders.o_id,orders.bill_status
                FROM customer
                INNER JOIN orders
                USING (c_id)
                WHERE customer.c_id=${req.params.id}
                ORDER BY  orders.date DESC 
                LIMIT 1`

    const query = db.query(sql,(err,result)=>{
        if(err) {
            console.log(err)
            res.send("err")
        }
        else{
            console.log(result)
            res.send(result)
        }
    })
}


const BillInfo = async(req,res)=>{
    const c_id = req.params.c_id
    const o_id = req.params.o_id
    let v_id=0,ndb_charge=0,ndb_id=0,v_charge=0,bool=-1;

    //console.log(c_id,o_id)

    const q = db.query(`SELECT scrap_service FROM orders WHERE o_id=${o_id}`,(err,result)=>{
        if(err) throw err;
        bool = result[0].scrap_service;
        //console.log("bool is : "+bool)
    })
    
    const query = db.query(`SELECT ndb_id FROM customer WHERE c_id=${c_id}`,(err,result)=>{
            if(err) throw err;
            ndb_id = result[0].ndb_id;
            
            const query = db.query(`SELECT v_id,charge from ndb WHERE ndb_id=${ndb_id}`,(err,result)=>{
                if(err) throw err;
                ndb_charge = result[0].charge;
                v_id = result[0].v_id;

                const query = db.query(`SELECT charge from vendor where v_id=${v_id}`,(err,result)=>{
                    v_charge = result[0].charge
                    const sql = `SELECT newspaper.name , newspaper.price,newspaper.scrap_price
                                    FROM newspaper INNER JOIN order_news USING (n_id) WHERE o_id=${o_id} `
                    const query = db.query(sql,(err,result)=>{
                        if(err) throw err;
                        //console.log(result)
                        //console.log(`${ndb_id} ${ndb_charge} ${v_id} ${v_charge}`)
                        for(i=0;i<result.length;i++){
                            result[i].price = (result[i].price+v_charge)*30 + ndb_charge - bool*result[i].scrap_price
                        } 
                        res.send(result)
                    })
                    
                })
            })
    })

    
}
    

router.route('/:id')
.get(GetCustomer)

router.route('/:c_id/:o_id')
.get(BillInfo)

module.exports = router;