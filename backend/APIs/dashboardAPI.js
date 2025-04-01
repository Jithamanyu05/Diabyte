const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const DashApp = express.Router();

require("dotenv").config();

DashApp.get("/updated-dashboard/",authMiddleware,async(req,res)=>{
    
});

module.exports = DashApp;