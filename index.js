const express = require("express")
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const Login = require("./routes/Login")


const ndbProfile = require("./routes/Ndb/ndbprofile")
const VendorProfile = require("./routes/Vendor/VendorProfile")
const News = require("./routes/Vendor/News")
const Vendorlist = require("./routes/Ndb/Vendorlist")
const Support = require("./routes/Customer/Support")

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',Login)
app.use('/vendor/profile',VendorProfile)
app.use('/ndb/profile',ndbProfile)
app.use('/vendor/addnews',News)
app.use('/ndb/vendorlist',Vendorlist)
app.use('/customer/support',Support)


app.listen('4000',()=>{
    console.log("Server Started")
})