const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const tools      = require('../time-functions')
const display      = require('../display-functions')
const stats      = require('../stats-functions')


function isLoggedIn(req,res,next) {
  if (req.user) return next();
  else {
    console.log("redirecting to home page");
    res.redirect('auth/login');
  }
}


function createDisplayData(goal, size) {
  let valuesOnly = goal.history.map(function(date){
    return date.value
  })
  for (let i = 0; i<6-tools.currentDay();i++){
    valuesOnly.push(0);
  }
  for (let i = 0; i<size;i++) {
    valuesOnly.unshift(0);
  }
  return valuesOnly.slice(valuesOnly.length-size)
}


/* GET home page */
router.get('/', isLoggedIn, (req, res, next) => {
  Goal.find({
    _user: req.user._id
  })
  .then(goals=> {
    for (let i = 0; i<goals.length; i++) {
      goals[i].displayData = createDisplayData(goals[i],42);
      goals[i].streak = stats.currentDaysStreak(goals[i])
    }
    res.render('index',{goals});
  })
});

/* GET  Post a New Goal Page */
router.get('/new-goal', isLoggedIn, (req,res,next)=> {
  res.render('new-goal')
})

router.get('/charts', (req,res,next)=>{
  res.render('charts')
})

//POST new goal to the database
router.post('/new-goal', isLoggedIn, (req,res,next)=> {
  Goal.create({
    title: req.body.title,
    frequency: req.body.frequency,
    history: [{date: tools.currentDate(), value: 0}],
    _user: req.user._id,
    lastUpdate: tools.currentDate(),
    nextWeekUpdate: tools.startDayOfFollowingWeek()
  })
  .then(goal=> {
    console.log("startDayOfFollowingWeek()", tools.startDayOfFollowingWeek())
    console.log("Goal created: ", goal);
    res.redirect('/')
  })
  .catch(err=> {
    console.log("Error at POST /new-goal", err);
  })
})


router.post('/update/:id', isLoggedIn, (req,res,next)=> {
  let newValue;
  let pointChange;
  let goalPromise = Goal.findById(req.params.id)
  let userPromise = User.findById(req.user._id)
  Promise.all([goalPromise,userPromise])
  .then(result => {
    let goal = result[0]
    let user = result[1]
    if (goal.history[goal.history.length - 1].value === 1) {
      newValue = 0;
      pointChange = -goal.pointValue
    } else {
      newValue = 1;
      pointChange = goal.pointValue
    }
    return [goal,user]
  })
  .then(result => {
    let goal = result[0]
    let user = result[1]
    let updatedDay = goal.history
    updatedDay[goal.history.length-1].value = newValue;
    Goal.findByIdAndUpdate(req.params.id,{
      history: updatedDay
    })
    .then(goal=>{
      console.log("goal value updated", goal)
    })
    .catch(err=> {
      console.log("there was an error", err)
    })
    return [goal,user]
  })
  .then(result => {
    let user = result[1]
    User.findByIdAndUpdate(user._id, {
      $inc: {totalPoints: pointChange}
    })
    .then(user=>{
      console.log("User points updated", user)
      res.redirect('/')
    })
    .catch(err=>{
      console.log("error", err)
    })
  })
  .catch(err=>{
    console.log("Promise All error",err)
  })
})


router.post('/deactivate/update/:id', isLoggedIn, (req,res,next)=> {
  let newValue;
  var pointChange;
  Goal.findById(req.params.id)
    .then(goal => {
      if (goal.history[goal.history.length -1].value === 1) {
        newValue = 0;
        pointChange = -goal.pointValue
      } else {
        newValue = 1;
        pointChange = goal.pointValue
      }
      return goal;
    })
    .then(goal => {
      const index = goal.history.length - 1;
      let updatedHistory = goal.history;
      updatedHistory[index].value = newValue;
      Goal.findByIdAndUpdate(req.params.id,{ 
          history: updatedHistory
      })
      .then(goal=> {
        console.log("The value was pushed to goal!", goal.history)
      })
      .catch(err=> {
        console.log("Error at POST Update/ID",err)
      })
    })
    .then(goal => {
      stats.addPointsToUser(goal,req.user)
      console.log("pointChange", pointChange)
      console.log("req.user._id point updates??", req.user._id)
      User.findByIdAndUpdate(req.user._id, {
        totalPoints: pointChange
      })
      console.log("req.user",req.user)
      res.redirect('/');
    })
    .catch(err => {
      console.log("Some error at Post Update",err)
    })
})








router.post('/quitHabit/:id', isLoggedIn, (req,res,next)=> {
  Goal.findByIdAndUpdate(req.params.id, {currentlyDoing: false})
    .then(_ => {res.redirect('/');})
})



module.exports = router;
