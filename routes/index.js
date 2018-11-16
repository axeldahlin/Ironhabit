const express   = require('express');
const router    = express.Router();
const Goal      = require("../models/Goal");
const User      = require("../models/User");
const tools     = require('../time-functions')
const display   = require('../display-functions')
const stats     = require('../stats-functions')
const helper    = require('../helper-functions')


//Middleware for checking if user is logged in
function isLoggedIn(req,res,next) {
  if (req.user) return next();
  else {
    res.render('signedOut');
  }
}


/* GET home page */
router.get('/', isLoggedIn, (req, res, next) => {
  Goal.find({
    _user: req.user._id
  })
  .then(goals=> {
    for (let i = 0; i<goals.length; i++) {
      goals[i].displayData = helper.createDisplayData(goals[i],42);
      goals[i].streak = stats.currentDaysStreak(goals[i]);
      goals[i].didHabitToday = stats.didHabitToday(goals[i]);
    }
    res.render('index',{goals});
  })
  .catch(err=>{
    console.log("error at GET /",err)
  })
});


/* GET  New Goal Page */
router.get('/new-goal', isLoggedIn, (req,res,next)=> {
  res.render('new-goal')
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
    .then(goal=>console.log("goal value updated", goal.title))
    .catch(err=> console.log("there was an error", err))
    return [user,pointChange]
  })
  .then(result => {             //User Update: user's totalPoints based  
    let user = result[0]        //on the pointValue of the goal
    User.findByIdAndUpdate(user._id, {
      $inc: {totalPoints: result[1]}
    })
    .then(user=>res.redirect('/'))
    .catch(err=>console.log("error", err))
  })
  .catch(err=>console.log("Promise All error",err))
})


router.post('/quit-habit/:id', isLoggedIn, (req,res,next)=> {
  Goal.findByIdAndUpdate(req.params.id, {currentlyDoing: false})
    .then(_ => {res.redirect('/');})
    .catch(err=>{console.log("Error at Post / Quit Habit", err)})
})


module.exports = router;