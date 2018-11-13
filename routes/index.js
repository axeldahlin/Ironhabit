const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");
 
//Converts 1-2 digit numbers to 2 digits
function twoDigits(n) {
  if (n<10) return "0" + n
  else return "" + n
}

//returns current date in string YYYY-MM-DD
function currentDate() {
  let today = new Date();
  let year = today.getFullYear()
  let month = twoDigits(today.getMonth() + 1)
  let date = twoDigits(today.getDate());
  return year + "-" + month + "-" + date
}

//returns day of week 0-6
function currentDay() {
  let today = new Date()
  return today.getDay();
}

function createDisplayData(goal, size) {
  let valuesOnly = goal.history.map(function(date){
    return date.value
  })
  console.log(valuesOnly);
  for (let i = 0; i<6-currentDay();i++){
    console.log("currentDay: ", currentDay())
    valuesOnly.push(0);
  }
  for (let i = 0; i<size;i++) {
    valuesOnly.unshift(0);
  }
  return valuesOnly.slice(valuesOnly.length-size)
}


/* GET home page */
router.get('/', (req, res, next) => {
  Goal.find()
  .then(goals=> {
    for (let i = 0; i<goals.length; i++) {
      goals[i].displayData = createDisplayData(goals[i],42);
    }
    res.render('index',{goals});
  })
});

router.get('/new-goal', (req,res,next)=> {
  res.render('new-goal')
})

router.post('/new-goal',(req,res,next)=> {
  Goal.create({
    title: req.body.title,
    frequency: req.body.frequency,
    history: [{date: currentDate(), value: 0}],
    _user: req.user._id,
    lastUpdate: currentDate()
  })
  .then(goal=> {
    console.log("Goal created: ", goal);
    res.redirect('/')
  })
  .catch(err=> {
    console.log("Error at POST /new-goal", err);
  })
})

router.post('/update/:id', (req,res,next)=> {
  let newValue;
  Goal.findById(req.params.id)
    .then(goal => {
      if (goal.history[goal.history.length -1].value === 1) {
        newValue = 0;
      } else {
        newValue = 1;
      }
      console.log(newValue)
      return goal;
    })
    .then( goal => {
      const index = goal.history.length - 1;
      let updatedHistory = goal.history;
      updatedHistory[index].value = newValue;
      Goal.findByIdAndUpdate(req.params.id,{ 
          history: updatedHistory
      })
      .then(goal=> {
        console.log("The value was pushed to goal!", goal.history2)
        res.redirect('/');
      })
      .catch(err=> {
        console.log("Error at POST Update/ID",err)
      })
    })
})

module.exports = router;
