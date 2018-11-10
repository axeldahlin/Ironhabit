const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");

function formatArray(historyArr) {
  if (historyArr.length < 42) {
    const differens = 42 - historyArr.length;
    for (let i = 0; i < differens; i++) {
      historyArr.unshift(0)
    }
  } 
  if (historyArr.length > 42) {
    historyArr = historyArr.slice(historyArr.length-42)
  }
    return historyArr
}

/* GET home page */
router.get('/', (req, res, next) => {
  Goal.find()
  .then(goals=> {
    for (let i = 0; i<goals.length; i++) {
      goals[i].history = formatArray(goals[i].history)
      console.log(goals[i].history)
    }
    res.render('index',{goals});
  })
});

module.exports = router;
