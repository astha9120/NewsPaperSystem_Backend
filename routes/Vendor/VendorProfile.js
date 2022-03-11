const express = require('express');
const router = express.Router();
const db = require('../db')




const VendorGet = (req,res) => {
    const id = parseInt(req.params.id);
    console.log("id is : "+id)
    const sql = `SELECT state,city,area,address,charge,phoneno,name FROM vendor where v_id=${id}`;
    const query = db.query(sql,(err,result)=>{
        console.log(id);
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
        phoneno:req.body.phoneno,
        name: req.body.name
    };
    const id = parseInt(req.params.id);
    const sql = `UPDATE vendor SET ? WHERE v_id=${id}`;
        const query = db.query(sql,data,(err,result)=>{
            if(err) throw err;
            res.send("yes");
            console.log(result)
            console.log('inserted'); 
        })
}


router.route('/profile/:id').put(VendorPost)

router.route('/:id').get(VendorGet)



module.exports = router;