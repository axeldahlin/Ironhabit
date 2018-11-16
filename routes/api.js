const express      = require('express');
const router       = express.Router();
const Goal         = require("../models/Goal");
const stats        = require('../stats-functions')



//GET Route to fetch data for the graph's on profile page
router.get('/api/userdata', (req,res,next)=> {
  let user = req.user
  Goal.find({_user: user.id, currentlyDoing: true})
  .then(goals=>{
    let dailySuccessRate = {}
    for (let i = 0; i<goals.length; i++) {
      dailySuccessRate[goals[i].title] = stats.numberDailySuccessesGoal(goals[i])/goals[i].history.length
    }
    let userData = {
      successDaysTotal: stats.getSuccessDay(goals),
      dailySuccessRate
      }
    res.json(userData)
  })
  .catch(err=> {
    console.log("Error at api/username",err)
  })
})


module.exports = router;