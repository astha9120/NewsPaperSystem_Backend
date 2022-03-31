const express = require('express');
const router = express.Router();
const db = require('../db');

const Ndblist = (req,res)=>{
    const sql = `SELECT name,ndb_id,address,area,city,state,phoneno,charge,v_id,accept from ndb`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
      
            res.send(result)
        
    })
}

const changeStatus = (req,res)=>{
    const id = parseInt(req.params.id);
    const sql = `UPDATE ndb SET accept = 1 WHERE ndb_id=${id}`
    const query= db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.send("yess")
        
    })
}

const del = (req,res)=>{
    // const id = parseInt(req.params.id);
    // const sql = `DELETE FROM ndb WHERE ndb_id=${id}`
    // const query = db.query(sql,(err,result)=>{
    //     if(err) throw err
    //     console.log(result);
        res.send("sucess")
//     })
}


router.route('/').get(Ndblist)
router.route('/:id').put(changeStatus).delete(del)


module.exports = router;