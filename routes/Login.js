const express = require('express');
const router = express.Router();
const db = require('./db')


const SignIn = (req,res)=>{

}

const SignUp = (req,res)=>{
        console.log(req.body);
        let data = {
            email:req.body.email,
            password:req.body.password,
            state:req.body.state,
            city:req.body.city};

        const sql = `INSERT INTO ${req.body.user} SET ?`
        const query = db.query(sql,data,(err,result)=>{
            if(err) throw err;
            res.send(`${req.body.user} created`);
            console.log(result)
        })
        
}



router.route('/signin')
    .post(SignIn)

router.route('/signup')
      .post(SignUp)


module.exports = router;