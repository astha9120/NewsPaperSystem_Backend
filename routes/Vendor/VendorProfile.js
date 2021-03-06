const express = require('express');
const router = express.Router();
const db = require('../db')
//test




const VendorGet = (req,res) => {
    const id = parseInt(req.params.id);
    console.log("id is : "+id)
    const sql = `SELECT state,city,area,address,charge,phoneno,name,accept FROM vendor where v_id=${id}`;
    const query = db.query(sql,(err,result)=>{
        console.log(id);
        if(err) 
            res.status(400).send("error")

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
        phoneno:req.body.phoneno,
        name: req.body.name,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
    };
    const id = parseInt(req.params.id);
    const sql = `UPDATE vendor SET ? WHERE v_id=${id}`;
        const query = db.query(sql,data,(err,result)=>{
            if(err) 
                res.status(400).send("error")

            res.send("yes");
            console.log(result)
            console.log('inserted'); 
        })
}


router.route('/:id')
.put(VendorPost)
.get(VendorGet)



module.exports = router;