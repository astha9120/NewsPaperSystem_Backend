const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const Login = require("./routes/Login")
const VendorProfile = require("./routes/Vendor/VendorProfile")
const News = require("./routes/Vendor/News")
const Vendorlist = require("./routes/Ndb/Vendorlist")

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',Login)
app.use('/vendor/vendorprofile',VendorProfile)
app.use('/vendor/addnews',News)
app.use('/customer/vendorlist',Vendorlist)


app.listen('4000',()=>{
    console.log("Server Started")
})