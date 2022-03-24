const express = require('express');
const router = express.Router();
const db = require('../db');


const GetCustomer = (req,res)=>{
    const id = req.params.id;
    
    const sql = `SELECT name,address,area,city,state,ndb_id FROM customer WHERE ndb_id=${id}`
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
            console.log(result);
            res.send(result)
        
    })

}


// router.route('/:id')
// .get(Vendors)

router.route('/:id')
.get(GetCustomer)
module.exports = router;