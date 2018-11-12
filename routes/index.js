const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");

 
<<<<<<< HEAD
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
=======
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
>>>>>>> 7e26a4b437669990535313025d402babca6604a7
}


/* GET home page */
router.get('/', (req, res, next) => {
  Goal.find()
  .then(goals=> {
    
    for (let i = 0; i<goals.length; i++) {
     


      goals[i].displayData = createDisplayData(goals[i]);
  
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
    currentWeek: [0, 0, 0, 0, 0, 0, 0],
    history: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
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

      console.log('DEBUG goal.currentWeek[today]:', goal.currentWeek[today])
      if (goal.currentWeek[today] === 1) {

        newValue = 0;

      } else {
        newValue = 1;
      }
      console.log(newValue)
    })
    .then( data => {
      Goal.findByIdAndUpdate(req.params.id,{ 
        $set: { 
          [`currentWeek.${today}`]: `${newValue}`
        }
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
