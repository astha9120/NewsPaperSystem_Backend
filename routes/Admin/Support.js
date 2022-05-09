const express = require('express');
const router = express.Router();
const db = require('../db');

const Support = (req,res)=>{
    const sql = `SELECT issue_id,suggestion,name,email from issue`
    const query= db.query(sql,(err,result)=>{
        if(err){ 
            res.status(400).send("error");
            throw err;
        }
        console.log(result)
      
            res.send(result)
        
    })
}


const Unsubscribe = (req,res)=>{
    let Nowdate =  new Date()
    const sql = `SELECT date,o_id,c_id from orders where subscribe=1`
    const query = db.query(sql,(err,result)=>{
        if(err){
            res.status(400).send("error");
            throw err;}
        //console.log(result);
        if(result.length==0)
        {
            res.send("done");
            return;
        }
        let i=0;
        let custmer_info = [];
        let order_info = [];
        for(i=0;i<result.length;i++){
            let d = new Date(result[i].date)
            let diff = Math.abs(Nowdate-d)
            diff= Math.floor(diff/(1000 * 3600 * 24))
            if(diff>30){
                custmer_info.push(result[i].c_id)
                order_info.push(result[i].o_id)
            }
        }
        // console.log(custmer_info)
        // console.log(order_info)
        if(custmer_info.length==0){
            res.send("done")
            return;
        }
        const sql2 = `UPDATE orders SET subscribe=0  WHERE o_id in (${order_info})`
        const q2 = db.query(sql2,(err,result2)=>{
            //console.log(result2);

            const sql3 = `select n_id,ndb_id from order_news inner join 
            orders using(o_id) inner join customer using (c_id) where o_id in (${order_info});`
            const q3 = db.query(sql3,(err,result3)=>{
                console.log(result3);
                result3.map(e=>{
                    const sql4 = `update ndb_list set count = count-1 where ndb_id = ${e.ndb_id} and n_id = ${e.n_id}`
                    const q4 = db.query(sql4,(errr,result4)=>{
                        // console.log(result4);
                    })
                })
                const sql5 = `delete from ndb_list where count=0 `
                const q5 = db.query(sql5,(err,result5)=>{
                    console.log(result5);
                    res.send("done")
                })
            })
        })
        
    
    })
}

router.route('/')
.get(Support)

router.route('/un')
.get(Unsubscribe)


module.exports = router;