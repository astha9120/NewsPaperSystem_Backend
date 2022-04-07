const express = require('express');
const router = express.Router();
const db = require('../db');

const GetQuantity = (req,res)=>{
    const sql = `SELECT newspaper.name , ndb_list.count 
                from ndb_list 
                inner join newspaper 
                using (n_id) where ndb_id=${req.params.id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result)
        res.send(result)
    })
    

}

const GetCustomer = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT c_id,name,address,area,city,state FROM customer WHERE ndb_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
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
                console.log(result2)
                

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

const GetNews = (req,res)=>{
    
    const id = req.params.id

    const sql = `SELECT c_id FROM customer WHERE ndb_id=${id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result)
        const ids = result.map(e=>e.c_id)
        const sql2= `select c_id,name from orders inner join order_news using(o_id) 
                        inner join newspaper using(n_id) where c_id in (${ids}) and subscribe=1`

        const q = db.query(sql2,(err,result2)=>{
            console.log(result2)
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
            res.send(fi_res)
        })
    })
}

const SendNoti = (req,res)=>{
    const id = req.params.id;
    const sql = `UPDATE customer SET log=1 WHERE ndb_id=${id}`
    const q = db.query(sql,(err,result)=>{
        console.log(result)
        res.send("Yes")
    })
}

router.route('/:id')
.get(GetCustomer)

router.route('/quantity/:id')
.get(GetQuantity)

router.route('/newspaper/:id')
.get(GetNews)

router.route('/send/:id')
.get(SendNoti)

module.exports = router;