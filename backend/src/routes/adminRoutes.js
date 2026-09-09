const express = require("express");

const router = express.Router();

const {AdminDetails}=require('../model/adminDetails')

router.post('/create-admin-profile' , AdminDetails)

module.exports=router