const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const Login = require("./routes/Login")
const VendorProfile = require("./routes/VendorProfile")
const News = require("./routes/News")

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',Login)
app.use('/',VendorProfile)
app.use('/addnews',News)

app.listen('4000',()=>{
    console.log("Server Started")
})