const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");

router.get('/profile', (req, res, next) => {

  const user = req.user;

  console.log('DEBUG req.user:', req.user)

  res.render('profile/profile', user)

});



module.exports = router;