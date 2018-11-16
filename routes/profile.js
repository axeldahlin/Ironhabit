const express     = require('express');
const router      = express.Router();
const Goal        = require("../models/Goal");
const User        = require("../models/User");
const uploadCloud = require('../config/cloudinary.js');
const stats       = require('../stats-functions')

//Middleware for checking if user is logged in
function isLoggedIn(req,res,next) {
  if (req.user) return next();
  else {
    res.render('signedOut');
  }
}


router.get('/profile', isLoggedIn, (req, res, next) => {
  const user = req.user;
  user.weeklyConsistency = stats.percentSuccessHabitWeeks(user)
  Goal.find({_user: user._id})
  .then(goals=>{
    user.topGoal = stats.determineLongestCurrentStreak(goals)[0]
    user.highestStreakValue = stats.determineLongestCurrentStreak(goals)[1]
    user.didHabitDays = stats.getSuccessDay(goals);
    for (let i = 0; i<goals.length; i++) {
      goals[i].dailySuccesses = stats.numberDailySuccessesGoal(goals[i])
    }
    res.render('profile/profile', {user,goals})
  })
  .catch(err=>{console.log("Error at /Profile", err)})
});


router.post('/uploadAvatarImg/:id', isLoggedIn, uploadCloud.single('photo'), (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    avatarImgPath: req.file.url
  })
  .then(_ => {
    res.redirect('/profile')
  })
  .catch(err=>{console.log("error at Post / upload",err)})
});


module.exports = router;