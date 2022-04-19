const express = require('express');
const router = express.Router();
const db = require('../db');

const GetQuantity = (req,res)=>{
    const sql = `SELECt ndb_id FROM ndb WHERE v_id=${req.params.id}`
    const query = db.query(sql,(err,result)=>{
        
        const val = result.map(e=>e.ndb_id)
       // console.log("ids")
       // console.log(val)
        if(val.length==0){
            res.send([])
            return;
        }

        const sql1 = `SELECT n_id , SUM(count) as count , name FROM ndb_list 
        INNER JOIN newspaper
        USING(n_id)
        WHERE ndb_id in (${val})
        GROUP BY n_id `
        const query = db.query(sql1,(err,result1)=>{
           // console.log("news quantitty")
           // console.log(result1)
            res.send(result1)
        })
    
    })
}

const GetNdb = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT name,ndb_id FROM ndb WHERE v_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
            
            //console.log("ids")
            //console.log(result);
            const ids = result.map(e=>e.ndb_id)
            if(ids.length==0){
                res.send([])
                return;
            }

            const sql2= `select ndb_id,name,count,newspaper.price from ndb_list inner join 
                         newspaper using(n_id) where ndb_id in (${ids}) order by ndb_id`

            const q = db.query(sql2,(err,result2)=>{
                //console.log("Get NBDS")
                //console.log(result2)
                const sql_q = `SELECT charge FROM vendor where v_id=${id}`
                const w = db.query(sql_q,(err,result_4)=>{
                    let fi_res=[],temp=[];
                    let fi_pr =[],temp_p=0;
                        
                        for(i=0;i<result2.length;i++){           
                            if(i==0 || result2[i].ndb_id==result2[i-1].ndb_id){
                                let f =  result2[i].count * (result2[i].price+result_4[0].charge)
                                temp_p+=f;
                                obj = {name:result2[i].name,count:result2[i].count,price:f}
                                temp.push(obj)
                            }
                            else{
                                    fi_res.push(temp)
                                    fi_pr.push(temp_p)
                                    temp_p=0;
                                    temp=[]
                                    let f =  result2[i].count * (result2[i].price+result_4[0].charge)
                                    temp_p+=f;
                                    obj = {name:result2[i].name,count:result2[i].count,price:f}
                                    temp.push(obj)
                            }
                        
                        }
                        
                fi_res.push(temp)
                fi_pr.push(temp_p)
                console.log(fi_pr)
                i=0;
                const send_res = result.map(r=>{
                    r.newspaper = fi_res[i]
                    r.total_p = fi_pr[i++]
                    return r;
                })
               console.log(send_res)
                res.send(send_res)
                }) 
                
            })

            //res.send(result)
    })

}

const GetCharge = (req,res)=>{
    const sql = `SELECT charge FROM vendor where v_id=${req.params.id}`
    const q = db.query(sql,(err,result)=>{
        res.send(result)
    })
}

router.route('/:id')
.get(GetNdb)

router.route('/quantity/:id')
.get(GetQuantity)

router.route('/charge/:id')
 .get(GetCharge)

module.exports = router;