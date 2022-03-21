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
const profile = require("./routes/Customer/Profile")
const Home = require("./routes/Customer/Home")
const Bill = require("./routes/Customer/Bill")
const BillCollection = require("./routes/Ndb/BillCollection")
const PastOrder = require("./routes/Customer/PastOrder")
const GetOrder = require("./routes/Customer/GetOrder")

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',Login)
app.use('/vendor/profile',VendorProfile)
app.use('/vendor/addnews',News)

app.use('/ndb/profile',ndbProfile)
app.use('/ndb/vendorlist',Vendorlist)
app.use('/ndb/billcollection',BillCollection)

app.use('/customer/support',Support)
app.use('/customer/profile',profile)
app.use('/customer/home',Home)
app.use('/customer/bill',Bill)
app.use('/customer/pastorder',PastOrder)
app.use('/customer/getorder',GetOrder)



app.listen('4000',()=>{
    console.log("Server Started")
})