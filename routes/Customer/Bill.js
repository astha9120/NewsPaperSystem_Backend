const express = require('express');
const router = express.Router();
const db = require('../db');

const Resubscribe = (req,res)=>{
    var fi_d = new Date();
    var month = fi_d.getUTCMonth()+1; //months from 1-12
    var day = fi_d.getUTCDate();
    var year = fi_d.getUTCFullYear();
    if(month<10){
        month = '0'+month.toString()
    }            
    if(day<10){
        day='0'+day.toString();
    }  
    
    newdate = year + "-" + month + "-" + day;
    console.log(newdate);
    const sql = `select * from orders where o_id = ${req.params.o_id}`
    const q = db.query(sql,(err,result)=>{
     
        
        console.log(fi_d);
        let data = {
            c_id:result[0].c_id,
            scrap_service:result[0].scrap_service,
            bill:result[0].bill,
            bill_status:0,
            subscribe:1,
            date: fi_d
        }
        console.log(data);
        const sql2 = `INSERT INTO orders SET ?`
        const q2 = db.query(sql2,data,(err,result2)=>{
            if(err) 
            {
                
            console.log(err)
            res.status(400).send("error")
            }
            
          
            let o_id;
            const sql3 = `SELECT * FROM orders WHERE c_id=${data.c_id} AND scrap_service=${data.scrap_service} 
            AND bill_status=0 AND  date='${newdate}' AND subscribe=1`
            const q3 = db.query(sql3,(err,result3)=>{
                if(err) {
                    console.log(err)
                    res.status(400).send("error")
                }
                else{
                    console.log("result after order")
                    o_id = result3[0].o_id;
                    console.log(`oid::${o_id}`);
                
                    const sql4 = `SELECT n_id FROM order_news WHERE o_id = ${req.params.o_id}`
                    const q4 = db.query(sql4,(err,result4)=>{
                        console.log(result4)
                        const ids = result4.map(e=>[o_id,e.n_id])
                        console.log(ids)
                        const sql5 = `INSERT INTO order_news VALUES ? `
                        const q5 = db.query(sql5,[ids],(err,result5)=>{
                                if(err) { console.log(err)
                                    res.status(400).send("error")};

                                const sql6 = `SELECT ndb_id FROM customer WHERE c_id=${req.params.c_id}`
                                const q6 = db.query(sql6,(err,result6)=>{
                                    console.log("ndb")
                                    console.log(result6[0].ndb_id)
                                    result4.map((e)=>{
                                        console.log(e.n_id)
                                        const sql_1 = `SELECT count from ndb_list WHERE ndb_id=${result6[0].ndb_id} and n_id=${e.n_id}`
                                        const q_1  = db.query(sql_1,(err,result7)=>{
                                            console.log("idsss")
                                            console.log(result7)
                                            if(result7.length===0){
                                                //INSERT
                                                const sql_3 = `INSERT INTO ndb_list VALUES (${result6[0].ndb_id},${e.n_id},1)`
                                                const query_4 = db.query(sql_3,(err,result8)=>{
                                                        console.log('insert')
                                                        console.log(result8)
                                                })
                                            }
                                            else{
                                                const sql_2 = `UPDATE ndb_list  SET count = count+1 where ndb_id =${result6[0].ndb_id} and n_id=${e.n_id}`
                                                const q_2 = db.query(sql_2,(err,result9)=>{
                                                    console.log("resss")
                                                    console.log(result9)
                                                })
                                            }
                                        })
                                    })
                            
                                })
                                //console.log(result)
                               res.send("success")
                        })
                    })  
                }
            })
        })

            
        
    })
    
}

const GetCustomer = (req,res)=>{
    const sql = `SELECT customer.name,customer.address,customer.area,orders.date,orders.scrap_service,orders.o_id,orders.bill_status,orders.subscribe
                FROM customer
                INNER JOIN orders
                USING (c_id)
                WHERE customer.c_id=${req.params.id}
                ORDER BY  orders.date DESC 
                LIMIT 1`

    const query = db.query(sql,(err,result)=>{
        if(err) {
            console.log(err)
            res.status(400).send("error")
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
        if(err) 
        {
            res.status(400).send("error")
            throw err};
        bool = result[0].scrap_service;
        //console.log("bool is : "+bool)
    })
    
    const query = db.query(`SELECT ndb_id FROM customer WHERE c_id=${c_id}`,(err,result)=>{
            if(err) {
                res.status(400).send("error")
                throw err};
            ndb_id = result[0].ndb_id;
            
            const query = db.query(`SELECT v_id,charge from ndb WHERE ndb_id=${ndb_id}`,(err,result)=>{
                if(err)
                {
                    res.status(400).send("error")
                    throw err};
                ndb_charge = result[0].charge;
                v_id = result[0].v_id;

                const query = db.query(`SELECT charge from vendor where v_id=${v_id}`,(err,result)=>{
                    v_charge = result[0].charge
                    const sql = `SELECT newspaper.name , newspaper.price,newspaper.scrap_price
                                    FROM newspaper INNER JOIN order_news USING (n_id) WHERE o_id=${o_id} `
                    const query = db.query(sql,(err,result)=>{
                        if(err){ 
                            res.status(400).send("error")
                            throw err};
                        //console.log(result)
                        //console.log(`${ndb_id} ${ndb_charge} ${v_id} ${v_charge}`)
                        for(i=0;i<result.length;i++){
                            result[i].price = (result[i].price+v_charge)*30 + ndb_charge 
                        } 
                        console.log(result)
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

router.route('/:c_id/:o_id')
.post(Resubscribe)

module.exports = router;