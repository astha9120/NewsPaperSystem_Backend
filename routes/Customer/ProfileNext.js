
// customer - lat,long
// ndb - work_a ,add 
// distance - work_a and customer (within 1km hai then assign-customer to that ndb) - and store the distance as well
// if not work_a then calculate distance between ndb_add - customer
// assign customer to ndb who has minimum distance (and don't have work area) and add work_a to customer's home address 




const express = require('express');
const router = express.Router();
const db = require('../db')




const customerGet = (req,res) => {
    
    const id = parseInt(req.params.id);
    // const sql3 = `SELECT ndb_id from customer where c_id=${id}`
    // const query1 = db.query(sql3,(err,result1)=>{
    //     if(result1[0].ndb_id ==="null")
    //     console.log(result1[0]);
    //     res.end("fail")
        
    // })
    const sql = `SELECT 
                n.n_id,n.name,n.scrap_price,(n.price+v.charge)*30+ndb.charge as cum_price
                FROM newspaper n
                JOIN service s ON s.n_id = n.n_id
                JOIN vendor v ON v.v_id = s.v_id
                JOIN ndb ON ndb.v_id = v.v_id
                JOIN customer c ON c.ndb_id = ndb.ndb_id where c.c_id=${id}
                `;
    const query = db.query(sql,(err,result)=>{
       
        if(err) throw err;
       res.send(result);
    })


}

const customerPost = async(req, res) => {
    
    console.log(
"in post "
    )
    
    let data = {
            c_id:parseInt(req.body.id),
            scrap_service:req.body.scrap,
            bill:req.body.bill,
            bill_status:req.body.billstatus,
            subscribe:req.body.subscription,
            date:req.body.date
    }
    const sql = `INSERT INTO orders SET ?`
    const query = db.query(sql,data,(err,result)=>{
            if(err) throw err;
    })

   console.log(`REQUEST`)
   console.log(req.body)
    let o_id;
    const sql1 = `SELECT * FROM orders WHERE c_id=${parseInt(req.body.id)} AND scrap_service=${req.body.scrap} AND bill_status=${req.body.billstatus}  AND  date='${req.body.date}'`

    // const sql1 = `SELECT o_id FROM orders WHERE c_id=${req.body.id} AND scrap_service=1 AND bill=${req.body.bill} AND bill_status=1 AND  date='2022-03-22'`
    const query1 = db.query(sql1,(err,result)=>{
        if(err) throw err;
        else{
            
            o_id = result[0].o_id;
            //console.log(`oid::${o_id}`);
           
            const data1 = req.body.newspaper.map((e)=>{
                    return ([o_id,e.n_id])
            })
            
              const sql2 = `INSERT INTO order_news VALUES ? `
              const query2 = db.query(sql2,[data1],(err,result)=>{
                    if(err) throw err;
                    //console.log(result)
                    res.send("success")
            })
        }
    })
    
    const sql3 = `SELECT ndb_id FROM customer WHERE c_id=${req.params.id}`
    const query_1 = db.query(sql3,(err,result)=>{
        console.log("ndb")
        console.log(result[0].ndb_id)
        req.body.newspaper.map((e)=>{
            console.log(e.n_id)
            const sql_1 = `SELECT count from ndb_list WHERE ndb_id=${result[0].ndb_id} and n_id=${e.n_id}`
            const q_1  = db.query(sql_1,(err,result1)=>{
                console.log("idsss")
                console.log(result1)
                if(result1.length===0){
                    //INSERT
                    const sql_3 = `INSERT INTO ndb_list VALUES (${result[0].ndb_id},${e.n_id},1)`
                    const query_4 = db.query(sql_3,(err,result2)=>{
                            console.log('insert')
                            console.log(result2)
                    })
                }
                else{
                    const sql_2 = `UPDATE ndb_list  SET count = count+1 where ndb_id =${result[0].ndb_id} and n_id=${e.n_id}`
                    const q_2 = db.query(sql_2,(err,result)=>{
                        console.log("resss")
                        console.log(result[0])
                    })
                }
            })
        })

    })
    
    
}


   


router.route('/:id').get(customerGet)
.post(customerPost)




module.exports = router;
