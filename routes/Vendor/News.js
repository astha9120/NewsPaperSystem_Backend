const express = require('express');
const router = express.Router();
const db = require('../db');


const AddNewsPaper = (req,res)=>{
    const sql = 'SELECT n_id,name FROM NEWSPAPER';
    const query = db.query(sql,(err,result)=>{
        if(err){
            res.status(400).send("error")
        }
        else{
            //console.log(result)
            res.send(result)
        }
    })
}

const Service = async(req,res)=>{
    const v_id = parseInt(req.body.id);
    const data = await req.body.newspaper.map((e)=>{
            return ([e.n_id,v_id])
    })

    //console.log(data);
    const sql = `INSERT INTO service VALUES ?`
    const query = db.query(sql,[data],(err,result)=>{
            if(err) 
                res.status(400).send("error")

            //console.log(result)
            res.send("success")
    })
}

const NewsFromVendor = (req,res)=>{

    const id = parseInt(req.params.id);
    const sql = `SELECT  newspaper.n_id,newspaper.name
        FROM newspaper  
        INNER JOIN service  
        using(n_id)
        where service.v_id=${id}`
    const query = db.query(sql,(err,result)=>{
        // console.log(result)
        if(err)
            res.status(400).send("error")

        if(result[0])
            res.send(result)
        else    
            res.send([])
    })
}

router.route('')
      .get(AddNewsPaper)
      .post(Service)

router.route('/:id')
      .get(NewsFromVendor)

module.exports = router;