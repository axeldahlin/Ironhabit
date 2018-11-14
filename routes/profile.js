const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');
const stats      = require('../stats-functions')


router.get('/profile', (req, res, next) => {
  const user = req.user;
  user.weeklyConsistency = stats.percentSuccessHabitWeeks(user)
  Goal.find({_user: user._id})
  .then(goals=>{
    let succesStats = stats.getSuccessDay(user, goals);
    console.log('DEBUG succesStats:', succesStats)
    console.log('DEBUG user:', user)


    // [user.topGoal,user.highestStreakValue] = stats.determineLongestCurrentStreak(goals);
    res.render('profile/profile', {user});
  })
  // user.yourUserStatistic = stats.yourStatisticsFunction(user)
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