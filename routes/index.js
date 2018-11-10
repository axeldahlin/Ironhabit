const express = require('express');
const router  = express.Router();
const Goal = require("../models/Goal");

function formatArray(history) {
  let newHistory = history
  if (history.length > 42) {
    newHistory = newHistory.slice(history.length-42)
  } else if (history.length < 42) {
    for (let i = 0; i<42-history.length;i++) {
      console.log("42 - history.length", 42-history.length)
      newHistory.unshift(0)
    }
  } 
  return newHistory
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
