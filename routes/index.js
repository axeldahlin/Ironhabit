const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const tools      = require('../time-functions')
const display      = require('../display-functions')
const stats      = require('../stats-functions')
const helper      = require('../helper-functions')


function isLoggedIn(req,res,next) {
  if (req.user) return next();
  else {
    res.redirect('auth/login');
  }
}


function createDisplayData(goal, size) {
  let valuesOnly = goal.history.map(function(date){
    return date.value
  })
  if (valuesOnly[valuesOnly.length - 1] === 1) {
    valuesOnly[valuesOnly.length - 1] = "today-active"
  } else {
    valuesOnly[valuesOnly.length - 1] = "today-inactive"
  }
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
      goals[i].streak = stats.currentDaysStreak(goals[i]);
      goals[i].didHabitToday = stats.didHabitToday(goals[i]);
    }
    res.render('index',{goals});
  })
  .catch(err=>{
    console.log("error at GET /",err)
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
    res.redirect('/')
  })
  .catch(err=> {
    console.log("Error at POST /new-goal", err);
  })
})


router.post('/update/:id', isLoggedIn, (req,res,next)=> {
  let goalPromise = Goal.findById(req.params.id)
  let userPromise = User.findById(req.user._id)
  Promise.all([goalPromise,userPromise])
  .then(result => {         //retrives the goal&user objects from database and determines
    let goal = result[0]    // new values for user.totalPoints & goal.history.value
    let user = result[1]
    let {newValue, pointChange} = helper.toggleValueAndPoints(goal) //helper to determine new values
    return [goal,user,newValue, pointChange]
  })
  .then(result => {          //Goal Update: history array      
    let goal = result[0]    //with  a new day {date: , value: } object
    let user = result[1]
    let pointChange = result[3]
    let newHistory = goal.history                          //makes a copy
    newHistory[goal.history.length-1].value = result[2];  //updates last element's val to newValue
    Goal.findByIdAndUpdate(req.params.id,{
      history: newHistory                                 //replaces in Mongo
    })
    .then(goal=>{
      console.log("goal value updated", goal.title)
    })
    .catch(err=> {
      console.log("there was an error", err)
    })
    return [user,pointChange]
  })
  .then(result => {             //User Update: user's totalPoints based  
    let user = result[0]        //on the pointValue of the goal
    User.findByIdAndUpdate(user._id, {
      $inc: {totalPoints: result[1]}
    })
    .then(user=>{
      console.log("User points updated", user.totalPoints)
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

router.get('/api/userdata', (req,res,next)=> {
  let user = req.user
  Goal.find({_user: user.id})
  .then(goals=>{
    res.json(stats.getSuccessDay(goals))
  })
  .catch(err=> {
    console.log("Error at api/username",err)
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



/* GET home page */
router.get('/api/myPerfomance', (req, res, next) => {


  res.send({hello: 'test from API'})

});


module.exports = router;
