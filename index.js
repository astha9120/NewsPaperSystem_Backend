const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const Login = require("./routes/Login")

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',Login)

app.listen('3000',()=>{
    console.log("Server Started")
})