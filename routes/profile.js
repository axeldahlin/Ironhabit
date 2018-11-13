const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');

router.get('/profile', (req, res, next) => {

  const user = req.user;

  console.log('DEBUG req.user:', req.user)

  res.render('profile/profile', {user})

});


router.post('/uploadAvatarImg/:id', uploadCloud.single('photo'), (req, res, next) => {
  // const { message, picName } = req.body;
  const user = req.user;

  const id = req.params.id;

  // console.log('DEBUG id:', id)

  console.log('DEBUG req.file.url:', req.file.url)

  User.findByIdAndUpdate(id, {
    avatarImgPath: req.file.url
  })
  .then(_ => {
    res.redirect('/profile')
  })
});




module.exports = router;