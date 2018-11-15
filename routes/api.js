const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const tools      = require('../time-functions')
const display      = require('../display-functions')
const stats      = require('../stats-functions')
const helper      = require('../helper-functions')


router.get('/api/userdata', (req,res,next)=> {
  let user = req.user
  Goal.find({_user: user.id})
  .then(goals=>{
    let dailySuccessRate = {}
    for (let i = 0; i<goals.length; i++) {
      // goals[i].dailySuccesses = stats.numberDailySuccessesGoal(goals[i])
      dailySuccessRate[goals[i].title] = stats.numberDailySuccessesGoal(goals[i])/goals[i].history.length
    }
    let stats2 = {
      successDaysTotal: stats.getSuccessDay(goals),
      dailySuccessRate
      }
    res.json(stats2)
  })
  .catch(err=> {
    console.log("Error at api/username",err)
  })
})


module.exports = router;