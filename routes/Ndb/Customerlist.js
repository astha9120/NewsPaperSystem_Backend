const express = require('express');
const router = express.Router();
const db = require('../db');


const GetCustomer = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT c_id,name,address,area FROM customer INNER JOIN orders using (c_id) WHERE ndb_id=${id} AND subscribe=1`
    const query = db.query(sql,(err,result)=>{
            if(err) 
                res.status(400).send("error")

            console.log(result);
            if(result.length==0){
                res.send([])
            }
            // res.send(result)
            else{
            const ids = result.map(e=>e.c_id)
            const sql2= `select c_id,name from orders inner join order_news using(o_id) 
                            inner join newspaper using(n_id) where c_id in (${ids}) and subscribe=1`
    
            const q = db.query(sql2,(err,result2)=>{
                if(err)
                    res.status(400).send("error")

                console.log(result2)
                
                    if(result2.length==0){
                        console.log("no")
                        res.send([])
                        return;
                    }
                    let fi_res=[],temp=[];
                    temp.push(result2[0].name)
                    for(i=1;i<result2.length;i++){
                        
                        if(result2[i].c_id==result2[i-1].c_id)
                            temp.push(result2[i].name)
                        
                        else{
                            fi_res.push(temp)
                            temp=[]
                            temp.push(result2[i].name)
                        }

                    }

                    fi_res.push(temp)
                    i=0;
                    const send_res = result.map(r=>{
                        r.newspaper = fi_res[i++]
                        return r;
                    })
                    console.log(send_res)
                    res.send(send_res)
                
                })
            }
    })

}


const SendNoti = (req,res)=>{
    const id = req.params.id;
    const list = req.body.list;
    console.log(list)
    const sql = `UPDATE customer SET log=1 WHERE ndb_id=${id} and c_id in (${list})`
    const q = db.query(sql,(err,result)=>{
        if(err)
            res.status(400).send("error")

        console.log(result)
        res.send("Yes")
    })
}

router.route('/:id')
.get(GetCustomer)

// router.route('/quantity/:id')
// .get(GetQuantity)

router.route('/send/:id')
.post(SendNoti)

module.exports = router;