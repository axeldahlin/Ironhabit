const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");

 
function formatArray(arr,desiredLength) {
  let d = new Date();
  let day = d.getDay();
  for (let i = 0; i<6-day;i++){
    arr.push(0)
  }
  for (let i = 0; i<desiredLength; i++) {
    arr.unshift(0);
  }
  return arr.slice(arr.length-desiredLength)
}


/* GET home page */
router.get('/', (req, res, next) => {
  Goal.find()
  .then(goals=> {
    for (let i = 0; i<goals.length; i++) {
      goals[i].history = formatArray(goals[i].history,42)
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
    history: [0],
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
  // // let date = new Date();
  // // let dateObject = {}
  // // let currentDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
  // // console.log("CurrentDate", currentDate)
  // dateObject[currentDate] = 1
  Goal.findByIdAndUpdate(req.params.id,{ 
    $push: {history: 1},
    // $push: {history2: dateObject}
  })
  .then(goal=> {
    console.log("The value was pushed to goal!", goal.history2)
    res.redirect('/');
  })
  .catch(err=> {
    console.log("Error at POST Update/ID",err)
  })
})


module.exports = router;
