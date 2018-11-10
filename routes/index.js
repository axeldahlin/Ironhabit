const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");


// function formatArray(historyArr) {
//   if (historyArr.length < 42) {
//     const differens = 42 - historyArr.length;
//     for (let i = 0; i < differens; i++) {
//       historyArr.unshift(0)
//     }
//   } 
//   if (historyArr.length > 42) {
//     historyArr = historyArr.slice(historyArr.length-42)
//   }
//     return historyArr
// }

//Hi Axel, I rewrote the function to make it nicer and more flexible. 
//I hope it does not complicate your merge. Please keep THIS version and delete the
//version I commented out above. If this creates issues for you let me know so I can be more 
//careful in the future. 
function formatArray(arr,desiredLength) {
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
      console.log(goals[i].history)
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


module.exports = router;
