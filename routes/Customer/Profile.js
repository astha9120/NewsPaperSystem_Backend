
// customer - lat,long
// ndb - work_a ,add 
// distance - work_a and customer (within 1km hai then assign-customer to that ndb) - and store the distance as well
// if not work_a then calculate distance between ndb_add - customer
// assign customer to ndb who has minimum distance (and don't have work area) and add work_a to customer's home address 




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

const customerGet = (req,res) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT state,city,area,address,phoneno,name FROM customer where c_id=${id}`;
    const query = db.query(sql,(err,result)=>{
        console.log(id);
        if(err) throw err;
        // res.json(query);
       res.send(result);
       console.log(result)
    
    })


}

const customerPost = (req, res) => {
    console.log(req.body);

    let data = {
        name:req.body.name,
        phoneno:req.body.phoneno,
        area: req.body.area,
        address: req.body.address,
        latitude:req.body.latitude,
        longitude:req.body.longitude
        
    };

    const id = parseInt(req.params.id);
        const sql  = `SELECT ndb_id,latitude,longitude,work_lat,work_long from ndb where v_id is not null and accept=1`
        const query =db.query(sql,(err,result)=>{
            if(err) throw err;
            let i,allocate_ndbid=-1 ,minDis=Number.MAX_VALUE;
            for(i=0;i<result.length;i++){
                if(result[i].work_lat!=null && result[i].work_long!=null){
                    let r =  distance(result[i].work_lat,result[i].work_long,req.body.latitude,req.body.longitude)
                   // console.log(`lat : ${result[i].work_lat} long ${result[i].work_long} 
                     //            c_lat ${req.body.latitude} c_long ${req.body.longitude}`)
                    console.log(r);
                    if(r<2){
                        allocate_ndbid = result[i].ndb_id;
                        data = { ...data, ndb_id:allocate_ndbid }
                        const sql = `UPDATE customer SET ? WHERE c_id=${id}`;
                        const query = db.query(sql,data,(err,result)=>{
                            if(err) throw err;
                            console.log(result)
                            res.send("yes");
                            console.log("within work area");

                            
                        })
                        return;
                    }
                   
                }
            }

            for(i=0;i<result.length;i++){
                if(result[i].work_lat==null && result[i].work_long==null){
                    let r =  distance(result[i].latitude,result[i].longitude,req.body.latitude,req.body.longitude);
                   // console.log(`lat : ${result[i].latitude} long ${result[i].longitude} 
                     //            c_lat ${req.body.latitude} c_long ${req.body.longitude}`)
                    console.log(r);
                    if(r<minDis && r<=5){
                        minDis=r;
                        allocate_ndbid=result[i].ndb_id;
                    }
                }
            }       
            if(allocate_ndbid==-1){
                console.log("not available")
                res.send("not available")
                return;         
            }

            data = {...data,ndb_id:allocate_ndbid}
            const sql = `UPDATE customer SET ? WHERE c_id=${id}`;
            const query = db.query(sql,data,(err,result)=>{
                if(err) throw err;
                console.log("values   : "+req.body.latitude+" "+req.body.longitude+" "+allocate_ndbid)
                const sql = `UPDATE ndb SET work_lat = ${req.body.latitude},work_long = ${req.body.longitude} 
                 where ndb_id=${allocate_ndbid}`
                 const query = db.query(sql,(err,result)=>{
                     console.log(result);
                     res.send("newly allocated");
                 })
            })            
        })
}


router.route('/:id')
.put(customerPost)
.get(customerGet)



module.exports = router;
