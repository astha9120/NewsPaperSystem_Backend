const express = require('express');
const router = express.Router();
const db = require('../db');

const GetQuantity = (req,res)=>{
    const sql = `SELECt ndb_id FROM ndb WHERE v_id=${req.params.id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result);
        
        const val = result.map(e=>e.ndb_id)
        console.log(val)
        const sql1 = `SELECT n_id , SUM(count) as count , name FROM ndb_list 
        INNER JOIN newspaper
        USING(n_id)
        WHERE ndb_id in (${val})
        GROUP BY n_id `
        const query = db.query(sql1,(err,result1)=>{
            console.log(result1)
            res.send(result1)
        })
    
    })
}

const GetNdb = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT name,ndb_id FROM ndb WHERE v_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
            //console.log(result);
            const ids = result.map(e=>e.ndb_id)
            const sql2= `select ndb_id,name,count from ndb_list inner join 
                         newspaper using(n_id) where ndb_id in (${ids}) order by ndb_id`

            const q = db.query(sql2,(err,result2)=>{
                //console.log(result2)
                let fi_res=[],temp=[];
                        
                for(i=0;i<result2.length;i++){           
                    if(i==0 || result2[i].ndb_id==result2[i-1].ndb_id){
                        obj = {name:result2[i].name,count:result2[i].count}
                        temp.push(obj)
                    }
                    else{
                            fi_res.push(temp)
                            temp=[]
                            obj = {name:result2[i].name,count:result2[i].count}
                            temp.push(obj)
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

            //res.send(result)
    })

}

const GetNews = (req,res)=>{
    const id = req.params.id;
    const sql = `SELECT ndb_id FROM ndb WHERE v_id=${id}`
    const query = db.query(sql,(err,result)=>{
        console.log(result)
        const ids = result.map(e=>e.ndb_id)
        const sql2= `select ndb_id,name,count from ndb_list inner join 
                     newspaper using(n_id) where ndb_id in (${ids}) order by ndb_id`

        const q = db.query(sql2,(err,result2)=>{
            console.log(result2)
            let fi_res=[],temp=[];
        
            for(i=0;i<result2.length;i++){           
                if(i==0 || result2[i].ndb_id==result2[i-1].ndb_id){
                    obj = {name:result2[i].name,count:result2[i].count}
                    temp.push(obj)
                }
                
                else{
                    fi_res.push(temp)
                    temp=[]
                    obj = {name:result2[i].name,count:result2[i].count}
                    temp.push(obj)
                }

            }

            fi_res.push(temp)
            res.send(fi_res)
        })
    })
}

// router.route('/:id')
// .get(Vendors)

router.route('/:id')
.get(GetNdb)

router.route('/quantity/:id')
.get(GetQuantity)

router.route('/newspaper/:id')
.get(GetNews)

module.exports = router;