const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');
const stats      = require('../stats-functions')


router.get('/about', (req, res, next) => {
  res.render('about/about')
});

module.exports = router;