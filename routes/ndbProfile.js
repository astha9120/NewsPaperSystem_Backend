const express = require('express');
const router = express.Router();
const db = require('./db')




const ndbGet = (req,res) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT state,city,area,address,charge,phoneno,name FROM ndb where ndb_id=${id}`;
    const query = db.query(sql,(err,result)=>{
        console.log(id);
        if(err) throw err;
        // res.json(query);
       res.send(result);
       console.log(result)
    
    })


}

const ndbPost = (req, res) => {
    console.log(req.body);

    let data = {
        charge: req.body.charge,
        area: req.body.area,
        address: req.body.address,
        phoneno:req.body.phoneno,
        name: req.body.name
    };
    const id = parseInt(req.params.id);
    const sql = `UPDATE ndb SET ? WHERE ndb_id=${id}`;
        const query = db.query(sql,data,(err,result)=>{
            if(err) throw err;
            res.send("yes");
            console.log(result)
            console.log('inserted'); 
        })
}


router.route('/profile/:id').put(ndbPost)

router.route('/:id').get(ndbGet)



module.exports = router;