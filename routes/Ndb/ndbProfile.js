const express = require('express');
const router = express.Router();
const db = require('../db')


function distance(lat1, lon1, lat2, lon2) {
    lon1 = lon1 * Math.PI / 180;
	lon2 = lon2 * Math.PI / 180;
	lat1 = lat1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(lat1) * Math.cos(lat2)
             * Math.pow(Math.sin(dlon / 2),2);
           
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return(c * r);
  }

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
        name: req.body.name,
        latitude:req.body.latitude,
        longitude:req.body.longitude
    };
    const id = parseInt(req.params.id);
        const sql  = `SELECT v_id,latitude,longitude from vendor`
        const query =db.query(sql,(err,result)=>{
            if(err) throw err;
            let i,allocate_vendorid ,minDis=Number.MAX_VALUE;
            for(i=0;i<result.length;i++){
                let r =  distance(result[i].latitude,result[i].longitude,req.body.latitude,req.body.longitude)
                if(r<minDis){
                    minDis=r;
                    allocate_vendorid = result[i].v_id
                }
            }
            console.log("id "+allocate_vendorid+" dis "+minDis)
            data = { ...data, v_id:allocate_vendorid }
            const sql = `UPDATE ndb SET ? WHERE ndb_id=${id}`;
            const query = db.query(sql,data,(err,result)=>{
                if(err) throw err;
                console.log(result)
                res.send("yes");
            })
        })
}


router.route('/:id')
.put(ndbPost)
.get(ndbGet)



module.exports = router;