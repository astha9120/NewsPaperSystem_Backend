const express = require('express');
const router = express.Router();
const db = require('./db')
//login

const SignIn = (req,res)=>{
    console.log(req.body);
    const sql = `SELECT * FROM ${req.body.user} WHERE email='${req.body.email}' and password='${req.body.password}'`
    const query = db.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            res.send("error")
        }
        else{
            if(result[0]){
                if(req.body.user==="customer")
                    res.send(`${result[0].c_id}`)
                else if(req.body.user==="ndb")
                    res.send(`${result[0].ndb_id}`)
                else if(req.body.user==="vendor")
                    res.send(`${result[0].v_id}`)
            }
                
            else
                res.send("error")
        }
    })
}

const SignUp = (req,res)=>{
        //console.log(req.body);
        let data = {
            email:req.body.email,
            password:req.body.password,
            state:req.body.state,
            city:req.body.city};

        const sql = `INSERT INTO ${req.body.user} SET ?`
        const query = db.query(sql,data,(err,result)=>{
            if(err){
                console.log(err)
                res.send("error")
            }
            else{
                res.send(`created`);
                console.log(result);
            }
        })
        
}



router.route('/signin')
    .post(SignIn)

router.route('/signup')
      .post(SignUp)


module.exports = router;