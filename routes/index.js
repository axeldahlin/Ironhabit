const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");


 
function createDisplayData(goal) {
  const lastWeek = goal.history.length - 1;
  let displayData = [
    ...goal.history[lastWeek-4],
    ...goal.history[lastWeek-3],
    ...goal.history[lastWeek-2],
    ...goal.history[lastWeek-1],
    ...goal.history[lastWeek],
    ...goal.currentWeek,
  ];
  // console.log('DEBUG displayData:', displayData)
  return displayData;
}

function createDisplayData2(goal, size) {
  let today = new Date();
  let dayToday = today.getDay();
  let valuesOnly = goal.history.map(function(date){
    return date.value
  })
  console.log(valuesOnly);
  for (let i = 0; i<6-dayToday;i++){
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
      goals[i].displayData = createDisplayData2(goals[i],42);
    }
    // console.log('DEBUG goals[]:', goals[])
    res.render('index',{goals});
  })
});

router.get('/new-goal', (req,res,next)=> {
  res.render('new-goal')
})


router.post('/new-goal',(req,res,next)=> {
  Goal.create({
    title: req.body.title,
    history: [],
    _user: req.user._id
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
  const today = new Date().getDay();
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
