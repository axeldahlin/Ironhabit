
const User = require("./models/User");
const Goal = require("./models/Goal");
const tools      = require('./time-functions')


let numberDaysSuccessful = function(goal) {
  return goal.history.reduce(function(acc,date){
    return acc + date.value
  },0)
}

let numberDaysAttempted = function(goal) {
  return goal.history.length
}

let currentDaysStreak = function(goal) {
  let streakCounter = 0
  let currentIndex = goal.history.length - 1
  streak = true
  while (streak && currentIndex >= 0) {
    if (goal.history[currentIndex].value === 1) {
      streakCounter++
      currentIndex--;
    }
    else streak = false
  }
  return streakCounter
}


let numberWeeksAttempted = function(goal) {

}


exports.currentDaysStreak = currentDaysStreak
exports.numberDaysAttempted = numberDaysAttempted
exports.numberDaysSuccessful = numberDaysSuccessful






 