const express = require('express');
const router = express.Router();
const db = require('./db')


const emailref="vendor1@gmail.com"


const VendorGet = (req,res) => {
        
    const sql = `SELECT state,city FROM vendor where email="${emailref}"`;
    const query = db.query(sql,(err,result)=>{
        if(err) throw err;
        // res.json(query);
       res.send(result);
       console.log(result)
    
    })


}

const VendorPost = (req, res) => {
    console.log(req.body);

    let data = {
        charge: req.body.charge,
        area: req.body.area,
        address: req.body.address,
        phoneno:req.body.phoneno
    };
    
    const sql = `UPDATE vendor SET ? WHERE email="${emailref}"`;
        const query = db.query(sql,data,(err,result)=>{
            if(err) throw err;
            res.send(`Data sent`);
            console.log(result)
            console.log('inserted'); 
        })
}


router.route('/vendorprofile').put(VendorPost)

router.route('').get(VendorGet)



module.exports = router;